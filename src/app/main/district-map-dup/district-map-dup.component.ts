import { Component, Input, Renderer2, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import * as htmlToImage from 'html-to-image';
import { DataService } from 'src/app/data.service';
import { DistrictService } from 'src/app/services/district/district.service';
import { DownloadPdf } from 'src/app/services/district/pdfdownload.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-district-map-dup',
  templateUrl: './district-map-dup.component.html',
  styleUrls: ['./district-map-dup.component.css']
})
export class DistrictMapDupComponent implements AfterViewInit{

    districtdatacum: any[] = [];
    StartDate: any;
    EndDate: any;
  
    downloadMapData
    () {
      this.downloadPdf$.updateanddownloadpdf()
    }
    // downloadMappdf() {
    //   this.downloadPdf$.updateanddownloadpdf()
    // }
  
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
    selectedDate: Date = new Date();
    inputValue: string = '';
    inputValue1: string = '';
    private initialZoom = 3.8;
    private map: L.Map = {} as L.Map;
  
    constructor(
      private http: HttpClient,
      private dataService: DataService,
      private renderer: Renderer2,
      private elRef: ElementRef,
      private district : DistrictService,
      private downloadPdf$ : DownloadPdf
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
          let fromAndToDates = JSON.parse(value);
          this.StartDate = fromAndToDates.fromDate;
          this.EndDate = fromAndToDates.toDate;
          // console.log(this.previousWeekWeeklyStartDate, this.previousWeekWeeklyEndDate);
        }
        else {
        this.StartDate = `${year}-${mon}-${dd}`;
        this.EndDate = `${year}-${mon}-${dd}`;
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
  
    const data = {
      startDate: this.StartDate,
      endDate: this.EndDate,
    };
      this.district.fetchDataFtp(data).subscribe(res => {
        this.districtdatacum = res.data;
        console.log('fbdudusdubsudbsud', res.data);
        this.loadGeoJSON();
      })
    
    }
  
    filter = (node: HTMLElement) => {
      const exclusionClasses = ['download', 'downloadpdf', 'leaflet-control-zoom', 'leaflet-control-fullscreen', 'leaflet-control-zoomin'];
      return !exclusionClasses.some((classname) => node.classList?.contains(classname));
  };
  
  
  findMatchingData(id: number): any | null {
  
    const matchedData = this.districtdatacum?.find((data: any) => {
      return data.district_code === id.toString()
    },
    );
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
        const mapElement = document.getElementById('map-district') as HTMLElement;
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
          link.download = 'DISTRICT_RAINFALL_MAP_COUNTRY_INDIA_cd.jpeg';
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
              link.download = 'DISTRICT_RAINFALL_MAP_COUNTRY_INDIA_cd.jpeg';
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
        pdf.save('DISTRICT_RAINFALL_MAP_COUNTRY_INDIA_cd.pdf');
    };
  }
  
  
  // async downloadMapImage() {
  //   try {
  //       const mapElement = document.getElementById('map-district') as HTMLElement;
  //       if (!mapElement) {
  //           throw new Error('Map element not found');
  //       }
  //       const scale = 8;
  //       const originalWidth = mapElement.clientWidth;
  //       const originalHeight = mapElement.clientHeight;
  //       const width = originalWidth * scale;
  //       const height = originalHeight * scale;
  
  //       // Set dimensions for the cropped area
  //       const cropWidth = 1200 * scale; // Width of the cropped area in the center
  //       const cropHeight = originalHeight+1175 * scale; // Full height
  //       const cropX = ((width - cropWidth) / 2)+500; // Centered horizontally
  //       const cropY = 0; // Starting at the top
  
  //       // Create a temporary canvas to crop the image
  //       const tempCanvas = document.createElement('canvas');
  //       tempCanvas.width = cropWidth;
  //       tempCanvas.height = cropHeight;
  //       const tempContext = tempCanvas.getContext('2d');
  
  //       const dataUrl = await htmlToImage.toJpeg(mapElement, {
  //           quality: 0.95,
  //           filter: this.filter,
  //           width: width,
  //           height: height,
  //           style: {
  //               transform: `scale(${scale})`,
  //               transformOrigin: 'top left',
  //               width: `${width}px`,
  //               height: `${height}px`
  //           }
  //       });
  
  //       // Load the captured image onto the temporary canvas
  //       const image = new Image();
  //       image.src = dataUrl;
  //       image.onload = () => {
  //           // Draw the central portion of the scaled image onto the temporary canvas
  //           tempContext?.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
  
  //           // Convert the cropped canvas back to a data URL
  //           const croppedDataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);
  
  //           // Trigger download
  //           const link = document.createElement('a');
  //           link.download = 'DISTRICT_RAINFALL_MAP_COUNTRY_INDIA_cd.jpeg';
  //           link.href = croppedDataUrl;
  //           link.click();
  //       };
  //   } catch (error) {
  //       console.error('Error downloading map image:', error);
  //   }
  // }
  
  
  
  
  
  
  
  
  
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
      this.map = L.map('map-district', {
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
    const logoImage = this.elRef.nativeElement.querySelector('#logoImage-district');
    const Header = this.elRef.nativeElement.querySelector('#middle-header-district');
    const directionCompass = this.elRef.nativeElement.querySelector('#compassArrow-district');
    const btn = this.elRef.nativeElement.querySelector('#all-btn-district');
    let legendsColor = this.elRef.nativeElement.querySelector('#leaflet-bottom-district');
    const celebrations = this.elRef.nativeElement.querySelector('#celebrations-district')
  
    if (isFullscreen) {
      this.map.setZoom(this.initialZoom + 1);
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
      this.renderer.setStyle(btn, 'right', '5%');
      this.renderer.setStyle(btn, 'top', '5%');
  
      this.renderer.setStyle(legendsColor, 'margin-left', '20%');
      this.renderer.setStyle(legendsColor, 'margin-right', '20%');
      // this.renderer.setStyle(legendsColor, 'display', 'flex');
  
      this.renderer.setStyle(celebrations, 'position', 'absolute');
      this.renderer.setStyle(celebrations, 'right', '30%');
      this.renderer.setStyle(celebrations, 'top', '5%');
      this.renderer.setStyle(celebrations, 'width', '20%'); // Set the desired width in percentage
      this.renderer.setStyle(celebrations, 'height', 'auto'); 
      this.renderer.setStyle(celebrations, 'zoom', '100%')
  
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
  
      this.renderer.removeStyle(celebrations, 'position');
      this.renderer.removeStyle(celebrations, 'right');
      this.renderer.removeStyle(celebrations, 'top');
      this.renderer.removeStyle(celebrations, 'width'); // Set the desired width in percentage
      this.renderer.removeStyle(celebrations, 'height'); 
  
      this.renderer.removeStyle(legendsColor, 'margin-left');
      this.renderer.removeStyle(legendsColor, 'margin-right');
      // this.renderer.removeStyle(legendsColor, 'display');
  
    }
  }
  
  
    private loadGeoJSON(): void {
      this.http.get('assets/geojson/INDIA_DISTRICT.json').subscribe((res: any) => {
        const districtLayer = L.geoJSON(res, {
          style: (feature: any) => {
            const id2 = feature.properties['district_c'];
            const matchedData = this.findMatchingData(id2);
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
              rainfall = ' '
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
            const id1 = feature.properties['district'];
            const id2 = feature.properties['district_c'];
            const matchedData = this.findMatchingData(id2);
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
            const normalrainfall = matchedData && !Number.isNaN(matchedData.normal_rainfall) ? matchedData.normal_rainfall : 'NA';
            const popupContent = `
            <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
              <div style="color: #002467; font-weight: bold; font-size: 10px;">DISTRICT: ${id1}</div>
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
  
  
      //     this.http.get('assets/geojson/INDIA_STATE.json').subscribe(
  //       (stateRes: any) => {
  //       const stateLayer = L.geoJSON(stateRes, {
  //         style: {
  //           weight: 1,
  //           opacity: 100,
  //           color: 'black',
  //           fillOpacity: 0
  //         }
  
  //       }).
  //       addTo(this.map);
  //     })
  
      console.log('loading is successful');
    }
    getColorForRainfall1(rainfall: any): string {

      
      if(rainfall == null || rainfall == ' ') {
        return '#c0c0c0';
      }

      const numericId = Math.round(rainfall);
      console.log('color', numericId)
      let cat = '';
      let count = 0

      
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