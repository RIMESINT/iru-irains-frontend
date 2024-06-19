import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import * as htmlToImage from 'html-to-image';
import { DataService } from 'src/app/data.service';
import { RegionService } from 'src/app/services/region/region.service';

@Component({
  selector: 'app-region-map',
  templateUrl: './region-map.component.html',
  styleUrls: ['./region-map.component.css']
})
export class RegionMapComponent {
regiondatacum: any[] = [];

  downloadMapData
  () {
    throw new Error('Method not implemented.');
  }
  downloadMappdf() {
    throw new Error('Method not implemented.');
  }

  @Input() fromDate: any;
  @Input() endDate: any;

  legendItems = [
    { color: '#0096ff', text: 'Large Excess [60% or more]', fontSize: '13px' },
    { color: '#32c0f8', text: 'Excess [20% to 59%]', fontSize: '13px' },
    { color: '#00cd5b', text: 'Normal [-19% to 19%]', fontSize: '13px' },
    { color: '#ff2700', text: 'Deficient [-59% to -20%]', fontSize: '13px' },
    { color: '#ffff20', text: 'Large Deficient [-99% to -60%]', fontSize: '13px' },
    { color: '#ffffff', text: 'No Rain [-100%]', fontSize: '13px' },
    { color: '#c0c0c0', text: 'No Data', fontSize: '13px' },
  ];

  formatteddate: any;
  StartDate: any;
  EndDate: any;
  selectedDate: Date = new Date();
  inputValue: string = '';
  inputValue1: string = '';
  private initialZoom = 4.3;
  private map: L.Map = {} as L.Map;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private regionService : RegionService,
  ) {
    // var currentDate = new Date();
    // var dd = String(currentDate.getDate());
    // var mon = String(currentDate.getMonth());
    // var year = String(currentDate.getFullYear());
    // this.formatteddate = `${dd.padStart(2, '0')}-${mon.padStart(2, '0')}-${year}`;

  const currentDate = new Date();
  const dd = String(currentDate.getDate()).padStart(2, '0');
  const mon = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = String(currentDate.getFullYear());
  this.formatteddate = `${dd}-${mon}-${year}`;

    this.dataService.fromAndToDate$.subscribe((value) => {
      if (value) {
        console.log('value', value)
        let fromAndToDates = JSON.parse(value);
        this.StartDate = fromAndToDates.fromDate;
        this.EndDate = fromAndToDates.toDate;
        // console.log(this.previousWeekWeeklyStartDate, this.previousWeekWeeklyEndDate);
      }
      else {
      // If no value is emitted, use the current date as the default
      this.StartDate = `${year}-${mon}-${dd}`;
      this.EndDate = `${year}-${mon}-${dd}`;
        console.log(this.StartDate);
        console.log(this.EndDate);
      }
      this.fetchBackend(); 
    });
  }


  async fetchBackend() {

  const currentDate = new Date();
  const dd = String(currentDate.getDate()).padStart(2, '0');
  const mon = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = String(currentDate.getFullYear());
    
    let data = {
    startDate: this.StartDate || `${year}-${mon}-${dd}`,
    endDate: this.EndDate || `${year}-${mon}-${dd}`
    }
    
    this.regionService.fetchData(data).subscribe(res => {
      this.regiondatacum = res.data;
      // console.log('REGION DATA', res.data);
      this.loadGeoJSON();
    })
  }

  filter = (node: HTMLElement) => {
    const exclusionClasses = ['download', 'downloadpdf', 'leaflet-control-zoom', 'leaflet-control-fullscreen', 'leaflet-control-zoomin'];
    return !exclusionClasses.some((classname) => node.classList?.contains(classname));
};


  findMatchingData(id: number): any | null {
    const matchedData = this.regiondatacum?.find((data: any) => {
    return data.r_code == id
  },);
  if (matchedData) {
    return matchedData;
  }
  else {
    return null;
  }
}

async downloadMapImage() {
    try {
        const mapElement = document.getElementById('map-region') as HTMLElement;
        if (!mapElement) {
            throw new Error('Map element not found');
        }

        const scale = 10; // Increase the scale to improve resolution
        const originalWidth = mapElement.clientWidth;
        const originalHeight = mapElement.clientHeight;
        const width = originalWidth * scale;
        const height = originalHeight * scale;

        // Set dimensions for the cropped area
        const cropWidth = 850 * scale;
        const cropHeight = originalHeight * scale;
        const cropX = (width - cropWidth) / 2;
        const cropY = 0

        // Create a temporary canvas to crop the image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = cropWidth;
        tempCanvas.height = cropHeight;
        const tempContext = tempCanvas.getContext('2d');

        const dataUrl = await htmlToImage.toJpeg(mapElement, {
            quality: 0.95,
            filter: this.filter,
            width: width,
            height: height,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: `${width}px`,
                height: `${height}px`
            }
        });

        // Load the captured image onto the temporary canvas
        const image = new Image();
        image.src = dataUrl;
        image.onload = () => {
            tempContext?.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
            
            // Convert the cropped canvas back to a data URL
            const croppedDataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);

            // Trigger download
            const link = document.createElement('a');
            link.download = 'RAINFALL_MAP_REGIONS_INDIA_cd.jpeg';
            link.href = croppedDataUrl;
            link.click();
        };
    } catch (error) {
        console.error('Error downloading map image:', error);
    }
}

  ngOnInit(){
    this.initMap();
  }

  ngAfterViewInit(): void {
    this.loadGeoJSON();
  }

  private initMap(): void {
    this.map = L.map('map-region', {
      center: [23, 76.9629],
      zoom: this.initialZoom,
      scrollWheelZoom: false
    });

    this.map.on('fullscreenchange', () => {
      this.toggleLogoPosition(this.isFullscreen());
    });

    const fullscreenControl = new (L.Control as any).Fullscreen({
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      },
      content: '<i class="bi bi-arrows-fullscreen"></i>'
    });

    this.map.addControl(fullscreenControl);
  }
  private isFullscreen(): boolean {
      
    return !!(document.fullscreenElement || document.fullscreenElement ||
      document.fullscreenElement || document.fullscreenElement);
  }

  private toggleLogoPosition(isFullscreen: boolean): void {
    const logoImage = this.elRef.nativeElement.querySelector('#logoImage3');
    const Header = this.elRef.nativeElement.querySelector('#middle-header-region');
    const directionCompass = this.elRef.nativeElement.querySelector('#compassArrow-region')
    const btn = this.elRef.nativeElement.querySelector('#all-btn-region')
    const legendsColor = this.elRef.nativeElement.querySelector('#legends-region');

    if (isFullscreen) {
       this.map.setZoom(this.initialZoom + 1);
      this.renderer.setStyle(logoImage, 'position', 'absolute');
      this.renderer.setStyle(logoImage, 'left', '600px');
      this.renderer.setStyle(logoImage, 'top', '36px');

      this.renderer.setStyle(Header, 'position', 'absolute');
      this.renderer.setStyle(Header, 'left', '240px');
      this.renderer.setStyle(Header, 'top', '60px');

      this.renderer.setStyle(directionCompass, 'position', 'absolute');
      this.renderer.setStyle(directionCompass, 'right', '670px');
      this.renderer.setStyle(directionCompass, 'top', '160px');
      
      this.renderer.setStyle(btn, 'position', 'absolute');
      this.renderer.setStyle(btn, 'right', '210px');
      this.renderer.setStyle(btn, 'top', '60px');

      // this.renderer.setStyle(legendsColor, 'position', 'absolute');
      this.renderer.setStyle(legendsColor, 'right', '-640px');
      this.renderer.setStyle(legendsColor, 'bottom', '18px');
      this.renderer.setStyle(legendsColor, 'width', '680px');
      this.renderer.setStyle(legendsColor, 'font-size', '50px');

     } else {
      this.map.setZoom(this.initialZoom);
      this.renderer.removeStyle(logoImage, 'position');
      this.renderer.removeStyle(logoImage, 'left');
      this.renderer.removeStyle(logoImage, 'top');

      this.renderer.removeStyle(Header, 'position');
      this.renderer.removeStyle(Header, 'left');
      this.renderer.removeStyle(Header, 'top');

      this.renderer.removeStyle(directionCompass, 'position');
      this.renderer.removeStyle(directionCompass, 'right');
      this.renderer.removeStyle(directionCompass, 'top');

      this.renderer.removeStyle(btn, 'position');
      this.renderer.removeStyle(btn, 'right');
      this.renderer.removeStyle(btn, 'top');

      this.renderer.removeStyle(legendsColor, 'right');
      this.renderer.removeStyle(legendsColor, 'bottom');
      this.renderer.removeStyle(legendsColor, 'width');

    }
  }

  private loadGeoJSON(): void {
    this.http.get('assets/geojson/INDIA_REGIONS.json').subscribe((res: any) => {
      const districtLayer = L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['region_cod'];
          // console.log('region code', id2)
          const matchedData = this.findMatchingData(id2);
          // console.log('matchedData',matchedData)
          let rainfall: any;
          if (matchedData) {
            if (Number.isNaN(matchedData.actual_rainfall)) {
              rainfall = ' ';
            }
            else {
              rainfall = matchedData.departure;
            }
          }
          else {
            rainfall = -100
          }
          const color = this.getColorForRainfall1(rainfall);

          return {
            fillColor: color,
            weight: 1,
            opacity: 1.5,
            color: 'black',
            fillOpacity: 100
          };

        },
        onEachFeature: (feature: any, layer: any) => {
          const id1 = feature.properties['region_nam'];
          const id2 = feature.properties['region_cod'];
          // console.log('SUBDIV ID' , id2)
          const matchedData = this.findMatchingData(id2);
          // console.log('matchedData', matchedData)
          let rainfall: any;
          if (matchedData) {
            if (Number.isNaN(matchedData.actual_rainfall)) {
              rainfall = "NA";
            }
            else {
              rainfall = matchedData.departure?.toFixed(2);
            }
          }
          else {
            rainfall = -100
          }
          const dailyrainfall = matchedData && matchedData.actual_rainfall !== null && matchedData.actual_rainfall != undefined && !Number.isNaN(matchedData.actual_rainfall) ? matchedData.actual_rainfall.toFixed(2) : 'NA';
          const normalrainfall = matchedData && !Number.isNaN(matchedData.rainfall_normal_value) ? matchedData.rainfall_normal_value : 'NA';
          // console.log('SUB DIV DAILY RAINFALL', dailyrainfall)
          // console.log('SUB DIV normalrainfall', normalrainfall)
          const popupContent = `
          <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
            <div style="color: #002467; font-weight: bold; font-size: 10px;">REGION: ${id1}</div>
            <div style="color: #002467; font-weight: bold; font-size: 10px;">DAILY RAINFALL: ${dailyrainfall}</div>
            <div style="color: #002467; font-weight: bold; font-size: 10px;">NORMAL RAINFALL: ${normalrainfall}</div>
            <div style="color: #002467; font-weight: bold; font-size: 10px;">DEPARTURE: ${rainfall}% </div>
          </div>
        `;
          layer.bindPopup(popupContent);
          layer.on('mouseover', () => {
            layer.openPopup();
          });
          layer.on('mouseout', () => {
            layer.closePopup();
          });
        }
      }).addTo(this.map);
    });

  }
  getColorForRainfall1(rainfall: any): string {
    const numericId = rainfall;
    let cat = '';
    let count = 0
    if (numericId == ' ') {
      return '#c0c0c0';
    }
    if (numericId >= 60) {
      cat = 'LE';
      return '#0393ff';
    }
    if (numericId >= 20 && numericId < 60) {
      cat = 'E';
      return '#69bef7';
    }
    if (numericId >= -19 && numericId < 20) {
      cat = 'N';
      return '#68dd58';
    }
    if (numericId >= -59 && numericId < -19) {
      cat = 'D';
      return '#fb4111';
    }
    if (numericId >= -99 && numericId < -59) {
      cat = 'LD';
      return '#ffff00';
    }

    if (numericId == -100) {
      cat = 'NR';
      count = count + 1;
      return '#ffffff';
    }

    else {
      cat = 'ND';
      return '#c0c0c0';
    }

  }
}
