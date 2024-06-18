import { Component, Input, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { DataService } from '../data.service';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import * as htmlToImage from 'html-to-image';

@Component({
  selector: 'app-district-map',
  templateUrl: './district-map.component.html',
  styleUrls: ['./district-map.component.css']
})
export class DistrictMapComponent implements AfterViewInit {
downloadMapData //             });
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

  previousWeekWeeklyEndDate: any;
  formatteddate: any;
  previousWeekWeeklyStartDate: any;
  selectedDate: Date = new Date();
  inputValue: string = '';
  inputValue1: string = '';
  private initialZoom = 4;
  private map: L.Map = {} as L.Map;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private renderer: Renderer2,
    private elRef: ElementRef
  ) {
    var currentDate = new Date();
    var dd = String(currentDate.getDate());
    var mon = String(currentDate.getMonth());
    var year = String(currentDate.getFullYear());
    this.formatteddate = `${dd.padStart(2, '0')}-${mon.padStart(2, '0')}-${year}`;

    this.dataService.fromAndToDate$.subscribe((value) => {
      if (value) {
        let fromAndToDates = JSON.parse(value);
        this.previousWeekWeeklyStartDate = fromAndToDates.fromDate;
        this.previousWeekWeeklyEndDate = fromAndToDates.toDate;
        console.log(this.previousWeekWeeklyStartDate, this.previousWeekWeeklyEndDate);
      }
    });

    this.loadGeoJSON();
  }

  filter = (node: HTMLElement) => {
    const exclusionClasses = ['download', 'downloadpdf', 'leaflet-control-zoom', 'leaflet-control-fullscreen', 'leaflet-control-zoomin'];
    return !exclusionClasses.some((classname) => node.classList?.contains(classname));
};

async downloadMapImage() {
    try {
        const mapElement = document.getElementById('map') as HTMLElement;
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
            link.download = 'STATE_RAINFALL_MAP_COUNTRY_INDIA_cd.jpeg';
            link.href = croppedDataUrl;
            link.click();
        };
    } catch (error) {
        console.error('Error downloading map image:', error);
    }
}

  


  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
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
    const logoImage = this.elRef.nativeElement.querySelector('#logoImage');
    const Header = this.elRef.nativeElement.querySelector('#middle-header');
    const directionCompass = this.elRef.nativeElement.querySelector('#compassArrow')
    const btn = this.elRef.nativeElement.querySelector('#all-btn')
    const legendsColor = this.elRef.nativeElement.querySelector('#legends');

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
    this.http.get('assets/geojson/INDIA_DISTRICT.json').subscribe((res: any) => {
      L.geoJSON(res, {
        style: (feature: any) => {
          return {
            fillColor: '#ffff',
            weight: 0.5,
            opacity: 2,
            color: 'black',
            fillOpacity: 0.7
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const id1 = feature.properties['district'];
          const popupContent = `
            <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
              <div style="color: #002467; font-weight: bold; font-size: 10px;">DISTRICT: ${id1}</div>
              <div style="color: #002467; font-weight: bold; font-size: 10px;">DAILY RAINFALL: 00 </div>
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

    console.log('loading is successful');
  }
}
