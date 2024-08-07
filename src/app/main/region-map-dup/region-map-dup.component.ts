import { Component, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import * as htmlToImage from 'html-to-image';
import { DataService } from 'src/app/data.service';
import { RegionService } from 'src/app/services/region/region.service';
import { RegionDownloadStatistics } from 'src/app/services/region/downloadStatisticsRegion.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-region-map-dup',
  templateUrl: './region-map-dup.component.html',
  styleUrls: ['./region-map-dup.component.css']
})
export class RegionMapDupComponent {

    regiondatacum: any[] = [];
    
      downloadMapData
      () {
        this.regionStatisticsDownload.updateanddownloadpdf()
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
      private initialZoom = 3.8;
      private defaultFontSizeonMap = 8;
    
      private map: L.Map = {} as L.Map;
    
    
      constructor(
        private http: HttpClient,
        private dataService: DataService,
        private renderer: Renderer2,
        private elRef: ElementRef,
        private regionService : RegionService,
        private regionStatisticsDownload : RegionDownloadStatistics
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
          this.calculateInitialZoom();
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
        
        this.regionService.fetchDataFtp(data).subscribe((res : any) => {
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
    
    
    downloadMappdf() {
      this.downloadMapImage(true)
    }
    
    async downloadMapImage(downloadpdf : boolean) {
      
      try {
          const mapElement = document.getElementById('map-region') as HTMLElement;
          if (!mapElement) {
              throw new Error('Map element not found');
          }
          const scale = 8;
          const originalWidth = mapElement.clientWidth;
          const originalHeight = mapElement.clientHeight;
          const width = originalWidth * scale;
          const height = originalHeight * scale;
    
          if(!this.isFullscreen()){
            const dataUrl = await htmlToImage.toJpeg(mapElement, {
                quality: 0.95,
                filter: this.filter,
                width: width,
                height: height,
                style: {
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left'
                }
            });
    
    
    
            const link = document.createElement('a');
            link.download = 'REGION_RAINFALL_MAP_COUNTRY_INDIA_cd.jpeg';
            link.href = dataUrl;
    
            if(downloadpdf){
              this.generatePDF(dataUrl)
            }else{
              link.click();
            }
    
          }
          else{
            const cropWidth = 1200 * scale; // Width of the cropped area in the center
            const cropHeight = originalHeight+1140 * scale; // Full height
            const cropX = ((width - cropWidth) / 2)+500; // Centered horizontally
            const cropY = 0; // Starting at the top
      
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
                // Draw the central portion of the scaled image onto the temporary canvas
                tempContext?.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      
                // Convert the cropped canvas back to a data URL
                const croppedDataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);
      
                // Trigger download
                const link = document.createElement('a');
                link.download = 'REGION_RAINFALL_MAP_COUNTRY_INDIA_cd.jpeg';
                link.href = croppedDataUrl;
    
                if(downloadpdf){
                  this.generatePDF(croppedDataUrl)
                }else{
                  link.click();
                }
            };
          }
    
      } catch (error) {
          console.error('Error downloading map image:', error);
      }
    }
    
     generatePDF(imageDataUrl: string) {
      const pdf = new jsPDF('landscape'); // Using landscape for better aspect ratio match
    
      const image = new Image();
      image.src = imageDataUrl;
      image.onload = () => {
          const imgProps = pdf.getImageProperties(imageDataUrl);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
    
          // Calculate the aspect ratio
          const imgWidth = imgProps.width;
          const imgHeight = imgProps.height;
          const aspectRatio = imgWidth / imgHeight;
    
          let newImgWidth = pdfWidth;
          let newImgHeight = pdfWidth / aspectRatio;
    
          if (newImgHeight > pdfHeight) {
              newImgHeight = pdfHeight;
              newImgWidth = pdfHeight * aspectRatio;
          }
    
          // Center the image in the PDF page
          const xOffset = (pdfWidth - newImgWidth) / 2;
          const yOffset = (pdfHeight - newImgHeight) / 2;
    
          pdf.addImage(imageDataUrl, 'JPEG', xOffset, yOffset, newImgWidth, newImgHeight);
          pdf.save('REGION_RAINFALL_MAP_COUNTRY_INDIA_cd.pdf');
      };
    }
    
    
    
      ngOnInit(){
        this.initMap();
      }
    
      ngAfterViewInit(): void {
        this.loadGeoJSON();
      }
    
    
    
    
    
      private calculateInitialZoom(): void {
        const cardWidth = window.innerWidth * 0.9;
        const cardHeight = window.innerHeight * 0.7; 
        this.initialZoom = this.calculateZoomLevel(cardWidth, cardHeight);
        this.defaultFontSizeonMap = (this.initialZoom)*2
    
      }
    
      private calculateZoomLevel(width: number, height: number): number {
        const zoomLevel = Math.log2(Math.max(width, height) / 90); 
    
        return zoomLevel;
      }
    
      @HostListener('window:resize')
      onWindowResize() {
       if(!this.isFullscreen()){
          this.calculateInitialZoom();
          if (this.map) {
            this.map.setZoom(this.initialZoom);
          }
        }
      }
    
    
      
      private initMap(): void {
        this.map = L.map('map-region', {
          center: [24, 80.9629],
          zoom: this.initialZoom,
          scrollWheelZoom: true,
          zoomSnap: 0.1,
          zoomDelta: 0.1
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
      public isFullscreen(): boolean {
          
        return !!(document.fullscreenElement || document.fullscreenElement ||
          document.fullscreenElement || document.fullscreenElement);
      }
    
      private toggleLogoPosition(isFullscreen: boolean): void {
        const logoImage = this.elRef.nativeElement.querySelector('#logoImage3');
        const Header = this.elRef.nativeElement.querySelector('#middle-header-region');
        const directionCompass = this.elRef.nativeElement.querySelector('#compassArrow-region')
        const btn = this.elRef.nativeElement.querySelector('#all-btn-region')
        const legendsColor = this.elRef.nativeElement.querySelector('#leaflet-bottom-region');
        const celebrations = this.elRef.nativeElement.querySelector('#celebrations-region')
    
    
        if (isFullscreen) {
          this.map.setZoom(this.initialZoom + 1);
          this.defaultFontSizeonMap = (this.initialZoom+1)*2
    
          this.renderer.setStyle(logoImage, 'position', 'absolute');
          this.renderer.setStyle(logoImage, 'left', '26%');
          this.renderer.setStyle(logoImage, 'top', '3.25%');
      
          this.renderer.setStyle(Header, 'position', 'absolute');
          this.renderer.setStyle(Header, 'left', '10%');
          this.renderer.setStyle(Header, 'top', '5%');
      
          this.renderer.setStyle(directionCompass, 'position', 'absolute');
          this.renderer.setStyle(directionCompass, 'right', '40%');
          this.renderer.setStyle(directionCompass, 'top', '20%');
          
          this.renderer.setStyle(btn, 'position', 'absolute');
          this.renderer.setStyle(btn, 'right', '10%');
          this.renderer.setStyle(btn, 'top', '5%');
      
          this.renderer.setStyle(legendsColor, 'margin-left', '20%');
          this.renderer.setStyle(legendsColor, 'margin-right', '20%');
    
          this.renderer.setStyle(celebrations, 'position', 'absolute');
          this.renderer.setStyle(celebrations, 'right', '30%');
          this.renderer.setStyle(celebrations, 'top', '5%');
          this.renderer.setStyle(celebrations, 'width', '20%'); // Set the desired width in percentage
          this.renderer.setStyle(celebrations, 'height', 'auto'); 
          this.renderer.setStyle(celebrations, 'zoom', '100%');
    
        } else {
          this.map.setZoom(this.initialZoom);
          this.defaultFontSizeonMap = (this.initialZoom)*2
    
      
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
    
          this.renderer.removeStyle(legendsColor, 'margin-left');
          this.renderer.removeStyle(legendsColor, 'margin-right');
      
          this.renderer.removeStyle(celebrations, 'position');
          this.renderer.removeStyle(celebrations, 'right');
          this.renderer.removeStyle(celebrations, 'top');
          this.renderer.removeStyle(celebrations, 'width'); 
          this.renderer.removeStyle(celebrations, 'height');
          
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
    
              // Determine label position and abbreviation
              let center = { lat: feature.properties['lat'], lng: feature.properties['lng'] };
    
              console.log('regionid',id1)
      
              if (id1 == "CENTRAL INDIA") {
                // id1 = "AR"
                center.lat = 23.9
                center.lng = 76.5
              }
              if (id1 == "SOUTH PENINSULA") {
                // id1 = "AS & ML"
                center.lat = 15
                center.lng = 74.7
              }
              if (id1 == "NORTH WEST INDIA") {
                // id1 = "NL & MN & MZ & TR"
                center.lat = 30.8
                center.lng = 76
    
              }
              if (id1 == "EAST AND NORTH EAST INDIA") {
                // id1 = "SHWB & SK"
                center.lat = 27.5
                center.lng = 89.5
              }
    
              // Add marker for state name
              if (center.lat && center.lng) {
    
                const labelId = `label-${id2}`;
    
    
                // Check if a label with the same ID already exists and remove it
                const existingLabel = document.getElementById(labelId);
                if (existingLabel) {
                  existingLabel.remove();
                }
    
    
                const label = L.marker([center.lat, center.lng], {
                  
                  icon: L.divIcon({
                    
    
                    className: 'state-label',
                    html: `
                    <div id="${labelId}" style="font-size: ${this.defaultFontSizeonMap}px; font-weight : 1000; color: #002467; width: 120px; text-align: center; white-space: nowrap;">
                      <div>${id1}</div>
                      <div>${dailyrainfall}(${rainfall})</div>
                      <div>${normalrainfall}</div>
                    </div>
                  `,
                    iconSize: [50, 10]  // Adjusts the label position relative to the centroid
                  })
                }).addTo(this.map);
              }
            }
          }).addTo(this.map);
        });
    
      }
      getColorForRainfall1(rainfall: any): string {
        const numericId = rainfall;
        let cat = '';
        let count = 0
        
        if(numericId == null) {
          return '#c0c0c0';
        }
        
        if (numericId === ' ') {
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