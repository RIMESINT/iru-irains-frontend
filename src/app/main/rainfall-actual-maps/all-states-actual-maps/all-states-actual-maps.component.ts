import {
  Component,
  Input,
  Renderer2,
  ElementRef,
  AfterViewInit,
  HostListener,
} from "@angular/core";
import * as L from "leaflet";
import { HttpClient } from "@angular/common/http";
import * as htmlToImage from "html-to-image";
import { DataService } from "src/app/data.service";
import { DistrictService } from "src/app/services/district/district.service";
import { DownloadPdf } from "src/app/services/district/pdfdownload.service";
import jsPDF from "jspdf";
import { CountryService } from "src/app/services/country/country.service";
import { MCRMCsService } from "src/app/services/MC-RMCs/mcRmc.service";
import { StateInformationService } from "src/app/services/state/allStates.service";
import { StateService } from "src/app/services/state/state.service";
import { DownloadPdfStateDistrict } from "src/app/services/district/states/districtStatesDownload.service";
import { Constants } from "src/app/services/constants";

@Component({
  selector: 'app-all-states-actual-maps',
  templateUrl: './all-states-actual-maps.component.html',
  styleUrls: ['./all-states-actual-maps.component.css']
})
export class AllStatesActualMapsComponent {

  districtdatacum: any[] = [];
  StartDate: any;
  EndDate: any;
  countrydatacum: any;
  countryActual: any;
  countryNormal: any;
  countryDeparture: any;
  isDownloading = false;
  isLoading: any = false;
  selectedStateCode : any;
  statedatacum: any;
  selectedMode: any;
  fromDate: any = this.formatDate(new Date());
  toDate: any = this.formatDate(new Date());

  async getSelectedStateCode() {
    const data = {
      startDate: this.selectedDate,
      endDate: this.selectedDate,
    };
  
    try {
      const res = await this.stateService.fetchData(data).toPromise(); // Convert the Observable to a Promise
      this.statedatacum = res.data;
      console.log("balu....", this.statedatacum);
      this.selectedStateCode = this.statedatacum.find((state: any) => state.state_name === this.selectedStateName).state_code;
      // this.loadGeoJSON(false);
      // this.StartDate = this.convertToIndianDateFormat(this.StartDate);
      // this.EndDate = this.convertToIndianDateFormat(this.EndDate);
    } catch (error) {
      console.error("Error fetching state data", error);
    }
  }
  


  async downloadMapData() {
    await this.getSelectedStateCode()
    this.isDownloading = true;
    try {
      this.isDownloading = true;
      console.log('selected start date and end date', this.selectedDate, this.selectedDate)
      if(this.selectedMode.selectedMode == 'Unified'){
        await this.downloadPdf$.updateanddownloadpdfCustom(this.fromDate, this.toDate, this.selectedStateCode);
      }else{
        await this.downloadPdf$.updateanddownloadpdfFromDataEntryCustom(this.fromDate, this.toDate, this.selectedStateCode);
      }      
      this.isDownloading = false;
    } catch (error) {
      console.error("Error downloading map data:", error);
    }
  }

  legendItems = [
    {
      color: "#abf200",
      text: `Very Light Rainfall <br>[0mm to 2.4mm]`,
      fontSize: "9.3px",
    },
    { color: "#03ff00", text: "Light Rainfall <br>[>2.4mm to 15.5mm]", fontSize: "9.3px" },
    { color: "#03ffff", text: "Moderate Rainfall <br>[>15.5mm to 64.4mm]", fontSize: "9.3px" },
    {
      color: "#ffff00",
      text: "Heavy Rainfall <br>[>64.4mm to 115.5mm]",
      fontSize: "9.3px",
    },
    {
      color: "#ff8c00",
      text: "Very Heavy Rainfall <br>[>115.5mm to 204.4mm]",
      fontSize: "9.3px",
    },
    { color: "#ff0000", text: "Extremely Heavy Rainfall <br>[>204.4]", fontSize: "9.3px" },
    { color: "#c0c0c0", text: "No <br>Data", fontSize: "9.3px" },
  ];

  formatteddate: any;
  selectedDate: any = this.formatDate(new Date()) ;
  inputValue: string = "";
  inputValue1: string = "";
  private initialZoom = 10;
  private map: L.Map = {} as L.Map;
  loggedInUserObject: any;


  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private district: DistrictService,
    private downloadPdf$: DownloadPdfStateDistrict,
    private countryService: CountryService,
    private stateinfoservice: StateInformationService,
    private stateService : StateService,
    private constants : Constants
  ) {

    const {startDate, endDate}  =  this.constants.getCurrentMonthSeasonFromAndToCurrentDate(new Date())
    this.fromDate = startDate
    this.EndDate = startDate

    const currentDate = new Date();
    const dd = String(currentDate.getDate()).padStart(2, "0");
    const mon = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = String(currentDate.getFullYear());
    this.formatteddate = `${dd}-${mon}-${year}`;

    let loggedInUser: any = localStorage.getItem("isAuthorised");
    this.loggedInUserObject = JSON.parse(loggedInUser);

    this.dataService.fromAndToDate$.subscribe((value) => {
      if (value) {
        let fromAndToDates = JSON.parse(value);
        this.StartDate = fromAndToDates.fromDate;
        this.EndDate = fromAndToDates.toDate;
        // console.log(this.previousWeekWeeklyStartDate, this.previousWeekWeeklyEndDate);
      } else {
        this.StartDate = `${year}-${mon}-${dd}`;
        this.EndDate = `${year}-${mon}-${dd}`;
      }
      this.calculateInitialZoom();
      this.fetchBackend();
    });


  }

  resetMapSmallScreen(): void {
    this.map.setView(
      this.stateinfoservice.getCordinates(this.selectedStateName),
      this.initialZoom
    );
  }

  convertToIndianDateFormat = (dateString: string) =>
    dateString.split("-").reverse().join("-");

  async fetchBackend() {

    let selectedMode: any = localStorage.getItem("selectedMode");
    this.selectedMode = JSON.parse(selectedMode);
    console.log('this.selected mOde', this.selectedMode)

    
    this.isLoading = true
    const currentDate = new Date();
    const dd = String(currentDate.getDate()).padStart(2, "0");
    const mon = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = String(currentDate.getFullYear());

    const data = {
      startDate: this.fromDate,
      endDate: this.toDate,
    };


    this.StartDate = this.fromDate.split('-').reverse().join('-')
    this.EndDate = this.toDate.split('-').reverse().join('-')

    if(this.selectedMode.selectedMode == 'Unified'){
      this.district.fetchDataFtp(data).subscribe((res) => {
        this.districtdatacum = res.data;
        console.log("fbdudusdubsudbsud", res.data);
        // const url = this.stateinfoservice.getMcRMCsJson()[this.loggedInUserObject.data[0].name].url
        // this.loadGeoJSON(url);
        this.StartDate = this.convertToIndianDateFormat(this.StartDate);
        this.EndDate = this.convertToIndianDateFormat(this.EndDate);
  
        this.selectedStateName =  this.selectedStateName=='' ? this.listOfmsRMCs[0]: this.selectedStateName
        this.selectedUrl =
          this.stateinfoservice.getMcRMCsJson()[this.selectedStateName].url || null;
        this.onWindowResizer()
        
        if (this.selectedUrl) {
          this.loadGeoJSON(this.selectedUrl);
        }
        this.isLoading = false
      });
      

      this.countryService.fetchDataFtp(data).subscribe((res) => {
        this.countrydatacum = res.data;
        this.countryActual = this.constants.trimToOneDecimals(
          this.countrydatacum[0].actual_rainfall
        );
        this.countryNormal = this.constants.trimToOneDecimals(
          parseFloat(this.countrydatacum[0].rainfall_normal_value)
        );
        this.countryDeparture = this.constants.trimToZeroDecimals(this.countrydatacum[0].departure);
        console.log(
          "country dep data FTP",
          this.countrydatacum,
          this.countryActual,
          this.countryDeparture,
          this.countryNormal
        );
      });

    }


    else{
      this.district.fetchData(data).subscribe((res) => {
        this.districtdatacum = res.data;
        console.log("fbdudusdubsudbsud", res.data);
        // const url = this.stateinfoservice.getMcRMCsJson()[this.loggedInUserObject.data[0].name].url
        // this.loadGeoJSON(url);
        this.StartDate = this.convertToIndianDateFormat(this.StartDate);
        this.EndDate = this.convertToIndianDateFormat(this.EndDate);

        this.selectedStateName =  this.selectedStateName=='' ? this.listOfmsRMCs[0]: this.selectedStateName
        this.selectedUrl =
          this.stateinfoservice.getMcRMCsJson()[this.selectedStateName].url || null;
        this.onWindowResizer()
        
        if (this.selectedUrl) {
          this.loadGeoJSON(this.selectedUrl);
        }
        this.isLoading = false
      });

      this.countryService.fetchData(data).subscribe((res) => {
        this.countrydatacum = res.data;
        this.countryActual = this.constants.trimToOneDecimals(
          this.countrydatacum[0].actual_rainfall
        );
        this.countryNormal = this.constants.trimToOneDecimals(
          parseFloat(this.countrydatacum[0].rainfall_normal_value)
        );
        this.countryDeparture = this.constants.trimToZeroDecimals(this.countrydatacum[0].departure);
        console.log(
          "country dep data Entry",
          this.countrydatacum,
          this.countryActual,
          this.countryDeparture,
          this.countryNormal
        );
      });   
    }


  }

  filter = (node: HTMLElement) => {
    const exclusionClasses = [
      "download",
      "downloadpdf",
      "leaflet-control-zoom",
      "leaflet-control-fullscreen",
      "leaflet-control-zoomin",
      "download-buttons",
      "DownloadMaps",
      "ResetMap",
    ];
    return !exclusionClasses.some((classname) =>
      node.classList?.contains(classname)
    );
  };

  findMatchingData(id: number): any | null {
    const matchedData = this.districtdatacum?.find((data: any) => {
      return data.district_code === id.toString();
    });
    if (matchedData) {
      return matchedData;
    } else {
      return null;
    }
  }

  downloadMappdf() {
    this.downloadMapImage(true);
  }

  async downloadMapImage(downloadpdf: boolean) {
    if (this.isFullscreen()) {
      this.resetMap();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    this.isDownloading = true;

    try {
      const mapElement = document.getElementById(
        "map-district-all-statemaps"
      ) as HTMLElement;
      if (!mapElement) {
        throw new Error("Map element not found");
      }
      const scale = 8;
      const originalWidth = mapElement.clientWidth;
      const originalHeight = mapElement.clientHeight;
      const width = originalWidth * scale;
      const height = originalHeight * scale;

      if (!this.isFullscreen()) {
        const dataUrl = await htmlToImage.toJpeg(mapElement, {
          quality: 0.95,
          filter: this.filter,
          width: width,
          height: height,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          },
        });

        const link = document.createElement("a");
        link.download = "DISTRICT_RAINFALL_MAP_COUNTRY_INDIA_cd.jpeg";
        link.href = dataUrl;

        if (downloadpdf) {
          this.generatePDF(dataUrl);
        } else {
          link.click();
        }
      } else {
        const cropWidth = 1200 * scale; // Width of the cropped area in the center
        const cropHeight = originalHeight + 1155 * scale; //1140
        const cropX = (width - cropWidth) / 2 + 2000; // Centered horizontally
        const cropY = 0; // Starting at the top

        // Create a temporary canvas to crop the image
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = cropWidth;
        tempCanvas.height = cropHeight;
        const tempContext = tempCanvas.getContext("2d");

        const dataUrl = await htmlToImage.toJpeg(mapElement, {
          quality: 0.95,
          filter: this.filter,
          width: width,
          height: height,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: `${width}px`,
            height: `${height}px`,
          },
        });

        // Load the captured image onto the temporary canvas
        const image = new Image();
        image.src = dataUrl;
        image.onload = () => {
          // Draw the central portion of the scaled image onto the temporary canvas
          tempContext?.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
          );

          // Convert the cropped canvas back to a data URL
          const croppedDataUrl = tempCanvas.toDataURL("image/jpeg", 0.95);

          // Trigger download
          const link = document.createElement("a");
          link.download = "DISTRICT_RAINFALL_MAP_COUNTRY_INDIA_cd.jpeg";
          link.href = croppedDataUrl;

          if (downloadpdf) {
            this.generatePDF(croppedDataUrl);
          } else {
            link.click();
          }
        };
      }
    } catch (error) {
      console.error("Error downloading map image:", error);
    }

    this.isDownloading = false;
  }

  generatePDF(imageDataUrl: string) {
    const pdf = new jsPDF("landscape"); // Using landscape for better aspect ratio match

    const image = new Image();
    image.src = imageDataUrl;
    image.onload = () => {
      const imgProps = pdf.getImageProperties(imageDataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

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

      pdf.addImage(
        imageDataUrl,
        "JPEG",
        xOffset,
        yOffset,
        newImgWidth,
        newImgHeight
      );
      pdf.save("DISTRICT_RAINFALL_MAP_COUNTRY_INDIA_cd.pdf");
    };
  }

  ngOnInit() {
    // this.selectedStateName = this.loggedInUserObject.data[0].name;
    // this.listOfmsRMCs = [
    //   ...this.listOfmsRMCs.filter((item: any) => item !== this.selectedStateName),
    // ];
    this.initMap();
  }

  ngAfterViewInit(): void {
    // const url = this.stateinfoservice.getMcRMCsJson()[this.loggedInUserObject.data[0].name].url
    // this.loadGeoJSON(url);
    // this.selectedStateName = this.listOfmsRMCs[0]
    // this.selectedUrl =
    //   this.stateinfoservice.getMcRMCsJson()[this.selectedStateName].url || null;
    // if (this.selectedUrl) {
    //   this.loadGeoJSON(this.selectedUrl);
    // }
  }

  private calculateInitialZoom(customZoomfactor: any = undefined): void {
    const cardWidth = window.innerWidth * 0.9;
    const cardHeight = window.innerHeight * 0.7;
    this.initialZoom = this.calculateZoomLevel(
      cardWidth,
      cardHeight,
      customZoomfactor
    );
  }

  private calculateZoomLevel(
    width: number,
    height: number,
    customZoomfactor: any = undefined
  ): number {
    console.log(
      "zoooom",
      customZoomfactor === undefined ? 20 : customZoomfactor
    );
    const zoomLevel = Math.log2(
      Math.max(width, height) /
        (customZoomfactor === undefined ? 20 : customZoomfactor)
    );
    return zoomLevel;
  }

  onWindowResizer() {
    if (!this.isFullscreen()) {
      // this.calculateInitialZoom();
      // console.log('zoomfactor console', this.stateinfoservice.getZoomFactor(this.selectedStateName))
      console.log('selected state name', this.selectedStateName)
      this.calculateInitialZoom(
        this.stateinfoservice.getZoomFactor(this.selectedStateName)
      );

      // if (this.map) {
      //   this.map.setZoom(this.initialZoom);
      //   console.log("hii");
      //   // this.map.setView([18, 78.9629], this.initialZoom);
      // }
    }
  }

  @HostListener("window:resize")
  onWindowResize() {
    if (!this.isFullscreen()) {
      // this.calculateInitialZoom();
      // console.log('zoomfactor console', this.stateinfoservice.getZoomFactor(this.selectedStateName))
      console.log('selected state name', this.selectedStateName)
      this.calculateInitialZoom(
        this.stateinfoservice.getZoomFactor(this.selectedStateName)
      );

      // if (this.map) {
      //   this.map.setZoom(this.initialZoom);
      //   console.log("hii");
      //   // this.map.setView([18, 78.9629], this.initialZoom);
      // }
    }
  }

  resetMap(): void {
    this.map.setView(
      this.stateinfoservice.getCordinates(this.selectedStateName),
      this.initialZoom + 1
    );
  }

  listOfmsRMCs: any = this.stateinfoservice.getListOfMcRMCs();

  selectedUrl: string | null = null;
  selectedStateName: any = "";

  onSelectChange(event: Event): void {
    console.log(this.listOfmsRMCs);
    const target = event.target as HTMLSelectElement;
    this.selectedStateName = target.value;
    this.selectedUrl =
      this.stateinfoservice.getMcRMCsJson()[this.selectedStateName].url || null;
    if (this.selectedUrl) {
      // this.selectedStateCode = 
      this.loadGeoJSON(this.selectedUrl);
    }
    this.onWindowResize()
    // this.resetMap()
  }

  onSubmit() {
    // console.log('Button clicked');
    this.fetchBackend()
    // Example usage of the button reference
    // this.submitButton.nativeElement.disabled = true;
  }

  private initMap(): void {
    this.map = L.map("map-district-all-statemaps", {
      center: [18, 78.9629],
      zoom: this.initialZoom,
      scrollWheelZoom: false,
      zoomSnap: 0.1,
      zoomDelta: 0.1,

      zoomControl: false, // Disables zoom on mouse scroll
      doubleClickZoom: false, // Disables zoom on double-click
      boxZoom: false, // Disables zoom using the mouse box
      touchZoom: false,
    });

    this.map.removeControl(this.map.zoomControl);
    this.map.dragging.disable();

    this.map.on("fullscreenchange", () => {
      this.toggleLogoPosition(this.isFullscreen());
    });

    const fullscreenControl = new (L.Control as any).Fullscreen({
      title: {
        false: "View Fullscreen",
        true: "Exit Fullscreen",
      },
      content: '<i class="bi bi-arrows-fullscreen"></i>',
    });

    this.map.addControl(fullscreenControl);
  }

  private districtLayer: any = null;

  private loadGeoJSON(httpUrl: any): void {
    if (this.districtLayer) {
      this.map.removeLayer(this.districtLayer);
    }

    this.http.get(httpUrl).subscribe((res: any) => {
      this.map.setView(this.stateinfoservice.getCordinates(this.selectedStateName), this.initialZoom);
      // this.map.setZoom(this.initialZoom);
      const districtLayer = L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties["district_c"];
          const matchedData = this.findMatchingData(id2);
          let rainfall: any;

          if (matchedData?.departure!=null) {
            rainfall = matchedData.departure;
          } else {
           rainfall = "NA";
          }

          const dailyrainfall =
          matchedData &&
          matchedData.actual_rainfall !== null &&
          matchedData.actual_rainfall != undefined &&
          !Number.isNaN(matchedData.actual_rainfall)
            ? this.constants.trimToOneDecimals(matchedData.actual_rainfall)
            : "NA";

        const color = this.constants.getActualColorForRainfall(dailyrainfall);

          return {
            fillColor: color,
            weight: 1,
            opacity: 1.5,
            color: "black",
            fillOpacity: 100,
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const state = feature.properties.state;
          const id1 = feature.properties["district"];
          const id2 = feature.properties["district_c"];
          const matchedData = this.findMatchingData(id2);
          let rainfall: any;
          
          if (matchedData?.departure!=null) {

            rainfall = this.constants.trimToZeroDecimals(matchedData.departure);
        } else {

          rainfall = "NA";
        }

          const dailyrainfall =
            matchedData &&
            matchedData.actual_rainfall !== null &&
            matchedData.actual_rainfall != undefined &&
            !Number.isNaN(matchedData.actual_rainfall)
              ? this.constants.trimToOneDecimals(matchedData.actual_rainfall) + " mm"
              : "NA";
          const normalrainfall =
            matchedData && !Number.isNaN(matchedData.normal_rainfall)
              ? this.constants.trimToOneDecimals(parseFloat(matchedData.normal_rainfall)) + " mm"
              : "NA";
          const popupContent = `
  <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
  <div style="color: #002467; font-weight: bold; font-size: 13px;">STATE: ${state}</div>
  <div style="color: #002467; font-weight: bold; font-size: 13px;">DISTRICT: ${id1}</div>
  <div style="color: #002467; font-weight: bold; font-size: 13px;">DAILY RAINFALL: ${dailyrainfall}</div>
  </div>
  `;
          layer.bindPopup(popupContent);
          layer.on("mouseover", () => {
            layer.openPopup();
          });
          layer.on("mouseout", () => {
            layer.closePopup();
          });
        },
      }).addTo(this.map);

      this.districtLayer = districtLayer;
    });

    console.log("loading is successful");
  }

  public isFullscreen(): boolean {
    return !!(
      document.fullscreenElement ||
      document.fullscreenElement ||
      document.fullscreenElement ||
      document.fullscreenElement
    );
  }

  private toggleLogoPosition(isFullscreen: boolean): void {
    const logoImage = this.elRef.nativeElement.querySelector(
      "#logoImage-district"
    );
    const Header = this.elRef.nativeElement.querySelector(
      "#middle-header-district"
    );
    const directionCompass = this.elRef.nativeElement.querySelector(
      "#compassArrow-district"
    );
    // const btn = this.elRef.nativeElement.querySelector('#all-btn-district');
    const resetButton = this.elRef.nativeElement.querySelector("#resetButton");

    let legendsColor = this.elRef.nativeElement.querySelector(
      "#leaflet-bottom-district"
    );
    const celebrations = this.elRef.nativeElement.querySelector(
      "#celebrations-district"
    );
    const country_val = this.elRef.nativeElement.querySelector(
      "#country_values-district"
    );
    const spinner = this.elRef.nativeElement.querySelector("#loading-message");

    if (isFullscreen) {
      this.map.addControl(this.map.zoomControl);
      this.map.dragging.enable();

      this.map.setZoom(this.initialZoom + 1);
      this.renderer.setStyle(logoImage, "position", "absolute");
      this.renderer.setStyle(logoImage, "left", "26%");
      this.renderer.setStyle(logoImage, "top", "3.25%");

      this.renderer.setStyle(Header, "position", "absolute");
      this.renderer.setStyle(Header, "left", "10%");
      this.renderer.setStyle(Header, "top", "5%");

      this.renderer.setStyle(directionCompass, "position", "absolute");
      this.renderer.setStyle(directionCompass, "right", "40%");
      this.renderer.setStyle(directionCompass, "top", "20%");

      // this.renderer.setStyle(btn, 'position', 'absolute');
      // this.renderer.setStyle(btn, 'right', '5%');
      // this.renderer.setStyle(btn, 'top', '5%');

      this.renderer.setStyle(legendsColor, "margin-left", "28%");
      this.renderer.setStyle(legendsColor, "margin-right", "20%");
      // this.renderer.setStyle(legendsColor, 'display', 'flex');

      this.renderer.setStyle(celebrations, "position", "absolute");
      this.renderer.setStyle(celebrations, "right", "30%");
      this.renderer.setStyle(celebrations, "top", "5%");
      this.renderer.setStyle(celebrations, "width", "20%"); // Set the desired width in percentage
      this.renderer.setStyle(celebrations, "height", "auto");
      this.renderer.setStyle(celebrations, "zoom", "100%");

      this.renderer.setStyle(country_val, "position", "absolute");
      this.renderer.setStyle(country_val, "left", "53%");
      this.renderer.setStyle(country_val, "top", "65%");

      this.renderer.setStyle(resetButton, "position", "absolute");
      this.renderer.setStyle(resetButton, "right", "42.7%");
      this.renderer.setStyle(resetButton, "top", "17%");
    } else {
      this.map.removeControl(this.map.zoomControl);
      this.map.dragging.disable();

      this.map.setZoom(this.initialZoom);

      this.renderer.removeStyle(logoImage, "position");
      this.renderer.removeStyle(logoImage, "left");
      this.renderer.removeStyle(logoImage, "top");

      this.renderer.removeStyle(Header, "position");
      this.renderer.removeStyle(Header, "left");
      this.renderer.removeStyle(Header, "top");

      this.renderer.removeStyle(directionCompass, "position");
      this.renderer.removeStyle(directionCompass, "right");
      this.renderer.removeStyle(directionCompass, "top");

      // this.renderer.removeStyle(btn, 'position');
      // this.renderer.removeStyle(btn, 'right');
      // this.renderer.removeStyle(btn, 'top');

      this.renderer.removeStyle(celebrations, "position");
      this.renderer.removeStyle(celebrations, "right");
      this.renderer.removeStyle(celebrations, "top");
      this.renderer.removeStyle(celebrations, "width");
      this.renderer.removeStyle(celebrations, "height");

      this.renderer.removeStyle(legendsColor, "margin-left");
      this.renderer.removeStyle(legendsColor, "margin-right");

      this.renderer.removeStyle(country_val, "position");
      this.renderer.removeStyle(country_val, "left");
      this.renderer.removeStyle(country_val, "top");

      this.renderer.removeStyle(resetButton, "position");
      this.renderer.removeStyle(resetButton, "left");
      this.renderer.removeStyle(resetButton, "top");
    }
  }

  // getColorForRainfall1(rainfall: any): string {
  //   if (rainfall == null || rainfall == " ") {
  //     return "#c0c0c0";
  //   }

  //   const numericId = Math.round(rainfall);
  //   console.log("color", numericId);
  //   let cat = "";
  //   let count = 0;

  //   if (numericId >= 60) {
  //     cat = "LE";
  //     return "#0393ff";
  //   }
  //   if (numericId >= 20 && numericId < 60) {
  //     cat = "E";
  //     return "#69bef7";
  //   }
  //   if (numericId >= -19 && numericId < 20) {
  //     cat = "N";
  //     return "#68dd58";
  //   }
  //   if (numericId >= -59 && numericId < -19) {
  //     cat = "D";
  //     return "#fb4111";
  //   }
  //   if (numericId >= -99 && numericId < -59) {
  //     cat = "LD";
  //     return "#ffff00";
  //   }

  //   if (numericId == -100) {
  //     cat = "NR";
  //     count = count + 1;
  //     return "#ffffff";
  //   } else {
  //     cat = "ND";
  //     return "#c0c0c0";
  //   }
  // }
}
