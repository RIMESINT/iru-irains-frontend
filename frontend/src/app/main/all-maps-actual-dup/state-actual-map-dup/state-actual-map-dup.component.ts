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
import { StateService } from "src/app/services/state/state.service";
import { StateDownloadStatistics } from "src/app/services/state/statisticsdownload.service";
import { StateInfoService } from "src/app/services/state/stateInfromation.service";
import { state } from "@angular/animations";
import jsPDF from "jspdf";
import { CountryService } from "src/app/services/country/country.service";
import { Constants } from "src/app/services/constants";
@Component({
  selector: 'app-state-actual-map-dup',
  templateUrl: './state-actual-map-dup.component.html',
  styleUrls: ['./state-actual-map-dup.component.css']
})
export class StateActualMapDupComponent implements AfterViewInit{

  statedatacum: any[] = [];
  countrydatacum: any;
  countryActual: any;
  countryNormal: any;
  countryDeparture: any;
  isLoading: boolean = false;

  // downloadMapData
  // () {
  // this.downloadStatistcs.updateanddownloadpdf()
  // }

  async downloadMapData() {
    this.isLoading = true;
    try {
      this.isLoading = true;
      await this.downloadStatistcs.updateanddownloadpdf();
      this.isLoading = false;
    } catch (error) {
      console.error("Error downloading map data:", error);
    }
  }

  @Input() fromDate: any;
  @Input() endDate: any;


  // legendItems = [
  //   {
  //     color: "#277620",
  //     text: `Very Light Rainfall <br>[0.1mm to 15.5mm]`,
  //     fontSize: "10.4px",
  //   },
  //   { color: "#1f9ee7", text: "Light Rainfall <br>[15.6mm to 64.4mm]", fontSize: "10.4px" },
  //   { color: "#f3e821", text: "Moderate Rainfall <br>[64.5mm to 115.5mm]", fontSize: "10.4px" },
  //   {
  //     color: "#ff8b00",
  //     text: "Heavy Rainfall <br>[115.6mm to 204.4mm]",
  //     fontSize: "10.4px",
  //   },
  //   {
  //     color: "#da1b1e",
  //     text: "Very Heavy Rainfall <br>[>=204.5mm]",
  //     fontSize: "10.4px",
  //   },
  // ];

  legendItems = [
    {
      color: "#277620",
      text: `Very light to light <br>[0.1 to 15.5]mm`,
      fontSize: "11.6px",
    },
    { color: "#1f9ee7", text: "Moderate <br>[15.6 to 64.4]mm", fontSize: "11.6px" },
    { color: "#f3e821", text: "Heavy <br>[64.5 to 115.5]mm", fontSize: "11.6px" },
    {
      color: "#ff8b00",
      text: "Very Heavy <br>[115.6 to 204.4]mm",
      fontSize: "11.6px",
    },
    {
      color: "#da1b1e",
      text: "Extremely Heavy <br>[>=204.5]mm",
      fontSize: "11.6px",
    },
  ];


  EndDate: any;
  formatteddate: any;
  StartDate: any;
  selectedDate: Date = new Date();
  inputValue: string = "";
  inputValue1: string = "";
  private initialZoom = 4.3;
  private defaultFontSizeonMap = 8;
  private map: L.Map = {} as L.Map;
  private fullscreenImageUrl = "assets/images/IMD150(BGR).png"; // Adjust this path to your actual image location
  private fullscreenImageElement: HTMLElement | null = null;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private stateService: StateService,
    private downloadStatistcs: StateDownloadStatistics,
    private stateinfo: StateInfoService,
    private countryService: CountryService,
    private constants: Constants
  ) {
    const currentDate = new Date();
    const dd = String(currentDate.getDate()).padStart(2, "0");
    const mon = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = String(currentDate.getFullYear());
    this.formatteddate = `${dd}-${mon}-${year}`;

    this.dataService.fromAndToDate$.subscribe((value) => {
      if (value) {
        let fromAndToDates = JSON.parse(value);
        this.StartDate = fromAndToDates.fromDate;
        this.EndDate = fromAndToDates.toDate;
      } else {
        // If no value is emitted, use the current date as the default
        this.StartDate = `${year}-${mon}-${dd}`;
        this.EndDate = `${year}-${mon}-${dd}`;
      }
      this.calculateInitialZoom();
      this.fetchBackend();
    });
  }

  convertToIndianDateFormat = (dateString: string) =>
    dateString.split("-").reverse().join("-");

  async fetchBackend() {
    const currentDate = new Date();
    const dd = String(currentDate.getDate()).padStart(2, "0");
    const mon = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = String(currentDate.getFullYear());

    const data = {
      startDate: this.StartDate || `${dd}-${mon}-${year}`,
      endDate: this.EndDate || `${dd}-${mon}-${year}`,
    };
    this.stateService.fetchDataFtp(data).subscribe((res) => {
      this.statedatacum = res.data;
      console.log("balu....", this.statedatacum);
      this.loadGeoJSON(false);
      this.StartDate = this.convertToIndianDateFormat(this.StartDate);
      this.EndDate = this.convertToIndianDateFormat(this.EndDate);
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
        "country dep data",
        this.countrydatacum,
        this.countryActual,
        this.countryDeparture,
        this.countryNormal
      );
    });
  }

  filter = (node: HTMLElement) => {
    const exclusionClasses = [
      "download",
      "downloadpdf",
      "leaflet-control-zoom",
      "leaflet-control-fullscreen",
      "leaflet-control-zoomin",
      "DownloadMaps",
      "ResetMap",
      "download-buttons",
    ];
    return !exclusionClasses.some((classname) =>
      node.classList?.contains(classname)
    );
  };

  findMatchingData(id: number): any | null {
    const matchedData = this.statedatacum?.find((data: any) => {
      return data.state_code === id;
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

    this.isLoading = true;

    try {
      const mapElement = document.getElementById(
        "map-state-actual-ftp"
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
        link.download = "STATE_RAINFALL_MAP_COUNTRY_INDIA_cd.jpeg";
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
          link.download = "STATE_RAINFALL_MAP_COUNTRY_INDIA_cd.jpeg";
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

    this.isLoading = false;
  }

  generatePDF(imageDataUrl: string) {
    const pdf = new jsPDF("landscape"); // Using landscape for better aspect ratio match

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

      pdf.addImage(
        imageDataUrl,
        "JPEG",
        xOffset,
        yOffset,
        newImgWidth,
        newImgHeight
      );
      pdf.save("STATE_RAINFALL_MAP_COUNTRY_INDIA_cd.pdf");
    };
  }

  ngOnInit() {
    this.initMap();
  }

  ngAfterViewInit(): void {
    this.loadGeoJSON(false);
  }

  private calculateInitialZoom(): void {
    const cardWidth = window.innerWidth * 0.9;
    const cardHeight = window.innerHeight * 0.7;
    this.initialZoom = this.calculateZoomLevel(cardWidth, cardHeight);
    this.defaultFontSizeonMap = this.initialZoom * 2.5;
    //  this.defaultFontSizeonMap = (this.initialZoom+1)*2
  }

  private calculateZoomLevel(width: number, height: number): number {
    const zoomLevel = Math.log2(Math.max(width, height) / 57);

    return zoomLevel;
  }

  @HostListener("window:resize")
  onWindowResize() {
    if (!this.isFullscreen()) {
      this.calculateInitialZoom();
      if (this.map) {
        this.map.setZoom(this.initialZoom);
        console.log("hii");
        this.map.setView([24, 81.9629], this.initialZoom);
      }
    }
  }

  resetMap(): void {
    this.map.setView([24, 80.9629], this.initialZoom + 0.3);
  }

  resetMapSmallScreen(): void {
    this.map.setView([24, 81.9629], this.initialZoom);
  }

  private initMap(): void {
    this.map = L.map("map-state-actual-ftp", {
      center: [24, 81.9629],
      zoom: this.initialZoom,
      scrollWheelZoom: false,
      zoomSnap: 0.1,
      zoomDelta: 0.1,
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
  public isFullscreen(): boolean {
    return !!(
      document.fullscreenElement ||
      document.fullscreenElement ||
      document.fullscreenElement ||
      document.fullscreenElement
    );
  }

  private toggleLogoPosition(isFullscreen: boolean): void {
    const logoImage =
      this.elRef.nativeElement.querySelector("#logoImage-state");
    const Header = this.elRef.nativeElement.querySelector(
      "#middle-header-state"
    );
    const directionCompass = this.elRef.nativeElement.querySelector(
      "#compassArrow-state"
    );
    // const btn = this.elRef.nativeElement.querySelector('#all-btn-state')
    const legendsColor = this.elRef.nativeElement.querySelector(
      "#leaflet-bottom-state"
    );
    const resetButton = this.elRef.nativeElement.querySelector("#resetButton");

    // const iRainsLogoImage = this.elRef.nativeElement.querySelector('#logo-irains-img')
    const celebrations = this.elRef.nativeElement.querySelector(
      "#celebrations-state"
    );
    // const fullscreenInfo = this.elRef.nativeElement.querySelector("#fullscreen-info")
    const country_val = this.elRef.nativeElement.querySelector(
      "#country_values-state"
    );

   const borderRemove = this.elRef.nativeElement.querySelector('#border-remove-state_dup')


    if (isFullscreen) {
      this.map.addControl(this.map.zoomControl);
      this.map.dragging.enable();

      this.loadGeoJSON(true);
      
      this.map.setZoom(this.initialZoom + 0.3);

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
      this.renderer.setStyle(resetButton, "left", "50.7%");
      this.renderer.setStyle(resetButton, "top", "5%");

      if (isFullscreen && borderRemove) {
        this.renderer.addClass(borderRemove, 'no-border');
      } 

    } else {
      this.map.removeControl(this.map.zoomControl);
      this.map.dragging.disable();

      this.renderer.removeClass(borderRemove, 'no-border');
      this.renderer.setStyle(borderRemove, 'border', '2px solid black');
     
      this.map.setZoom(this.initialZoom);
      this.loadGeoJSON(false);

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

      this.renderer.removeStyle(legendsColor, "margin-left");
      this.renderer.removeStyle(legendsColor, "margin-right");

      this.renderer.removeStyle(celebrations, "position");
      this.renderer.removeStyle(celebrations, "right");
      this.renderer.removeStyle(celebrations, "top");
      this.renderer.removeStyle(celebrations, "width");
      this.renderer.removeStyle(celebrations, "height");

      this.renderer.removeStyle(country_val, "position");
      this.renderer.removeStyle(country_val, "left");
      this.renderer.removeStyle(country_val, "top");

      this.renderer.removeStyle(resetButton, "position");
      this.renderer.removeStyle(resetButton, "left");
      this.renderer.removeStyle(resetButton, "top");
    }
  }

  private loadGeoJSON(isFullScreen: boolean): void {
    this.http.get("assets/geojson/INDIA_STATE.json").subscribe((res: any) => {
      const districtLayer = L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties["state_code"];
          const matchedData = this.findMatchingData(id2);
          let rainfall: any;
          if (matchedData?.departure!=null) {
            rainfall = matchedData.departure;
          } else {
            rainfall = "NA";
          }
          let dailyrainfall =
          matchedData &&
          matchedData.actual_state_rainfall !== null &&
          matchedData.actual_state_rainfall != undefined &&
          !Number.isNaN(matchedData.actual_state_rainfall)
            ? this.constants.trimToOneDecimals(
                matchedData.actual_state_rainfall
              )
            : "NA";
          const color = this.constants.getActualColorForRainfall(dailyrainfall);

          return {
            fillColor: color,
            weight: 1,
            opacity: 0.3, //1.5
            color: "black",
            fillOpacity: 100,
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          let id1 = feature.properties["state_name"];
          let id2 = feature.properties["state_code"];
          // console.log('STATE ID', id2)
          const matchedData = this.findMatchingData(id2);
          let rainfall: any;
          if (matchedData?.departure!=null) {

            rainfall = this.constants.trimToZeroDecimals(matchedData.departure);
            
          } else {
            rainfall = "NA";
          }
          let dailyrainfall =
            matchedData &&
            matchedData.actual_state_rainfall !== null &&
            matchedData.actual_state_rainfall != undefined &&
            !Number.isNaN(matchedData.actual_state_rainfall)
              ? this.constants.trimToOneDecimals(
                  matchedData.actual_state_rainfall
                )
              : "NA";
          let normalrainfall =
            matchedData && !Number.isNaN(matchedData.rainfall_normal_value)
              ? this.constants.trimToOneDecimals(
                  parseFloat(matchedData.rainfall_normal_value)
                )
              : "NA";

          // Determine label position and abbreviation
          let stateName = id1;
          let center = {
            lat: feature.properties["lat"],
            lng: feature.properties["lng"],
          };

          if (id1 == "ARUNACHAL PRADESH") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 29;
            center.lng = 94.2;
          }
          if (id1 == "LADAKH (UT)") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 35.3;
            center.lng = 76;
          }
          if (id1 == "JAMMU & KASHMIR (UT)") {
            if (!isFullScreen) {
              stateName = "JK";
            }
            center.lat = 34.5;
            center.lng = 73.2;
          }
          if (id1 == "HIMACHAL PRADESH") {
            if (!isFullScreen) {
              stateName = "HP";
            }
            center.lat = 32.7;
            center.lng = 76;
          }
          if (id1 == "PUNJAB") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 31.5;
            center.lng = 73.8;
          }
          if (id1 == "CHANDIGARH (UT)") {
            if (!isFullScreen) {
              stateName = "CH";
            }
            center.lat = 30.8;
            center.lng = 76;
          }
          if (id1 == "UTTARAKHAND") {
            if (!isFullScreen) {
              stateName = "UK";
            }
            center.lat = 30.2;
            center.lng = 78.5;
          }
          if (id1 == "HARYANA") {
            if (!isFullScreen) {
              stateName = "HR";
            }
            center.lat = 29.5;
            center.lng = 75;
          }
          if (id1 == "DELHI (UT)") {
            if (!isFullScreen) {
              stateName = "DL";
            }
            center.lat = 28.7;
            center.lng = 77.1;
          }
          if (id1 == "UTTAR PRADESH") {
            if (!isFullScreen) {
              stateName = "UP";
            }
            center.lat = 27.2;
            center.lng = 79.2;
          }
          if (id1 == "RAJASTHAN") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 27;
            center.lng = 72;
          }
          if (id1 == "GUJARAT") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 23.5;
            center.lng = 71;
          }
          if (id1 == "MADHYA PRADESH") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 23.9;
            center.lng = 76.5;
          }
          if (id1 == "DADRA & NAGAR HAVELI AND DAMAN & DIU (UT)") {
            stateName = "D & NH-D & D (UT)";
            // DADRA & NAGAR HAVELI AND DAMAN & DIU (UT)
            if (!isFullScreen) {
              stateName = "D & NH-D & D (UT)";
            }
            center.lat = 21.5;
            center.lng = 72;
          }
          if (id1 == "MAHARASHTRA") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 19.5;
            center.lng = 74;
          }
          if (id1 == "TELANGANA") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 18;
            center.lng = 77.7;
          }
          if (id1 == "GOA") {
            if (!isFullScreen) {
              stateName = "MP";
            }
            center.lat = 16.5;
            center.lng = 72.7;
          }
          if (id1 == "KARNATAKA") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 15;
            center.lng = 74.7;
          }
          if (id1 == "ANDHRA PRADESH") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 15.5;
            center.lng = 78;
          }
          if (id1 == "TAMILNADU") {
            if (!isFullScreen) {
              stateName = "TN";
            }
            center.lat = 11.5;
            center.lng = 77.5;
          }
          if (id1 == "LAKSHADWEEP (UT)") {
            if (!isFullScreen) {
              stateName = 'LAKSHADWEEP';
            }
            center.lat = 10.8;
            center.lng = 71.5;
          }
          if (id1 == "KERALA") {
            if (!isFullScreen) {
              stateName = "KL";
            }
            center.lat = 10.5;
            center.lng = 75.5;
          }
          if (id1 == "PUDUCHERRY (UT)") {
            if (!isFullScreen) {
              stateName = "PD";
            }
            center.lat = 11.5;
            center.lng = 79.5;
          }
          if (id1 == "CHHATTISGARH") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 22;
            center.lng = 81;
          }
          if (id1 == "ODISHA") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 20.8;
            center.lng = 83.3;
          }
          if (id1 == "JHARKHAND") {
            if (!isFullScreen) {
              stateName = "JR";
            }
            center.lat = 23.6;
            center.lng = 84;
          }
          if (id1 == "WEST BENGAL") {
            if (!isFullScreen) {
              stateName = "WB";
            }
            center.lat = 23.7;
            center.lng = 86.8;
          }
          if (id1 == "BIHAR") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 26;
            center.lng = 85.3;
          }
          if (id1 == "SIKKIM") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 28.5;
            center.lng = 88;
          }
          if (id1 == "ASSAM") {
            if (!isFullScreen) {
              stateName = "AS";
            }
            center.lat = 26.8;
            center.lng = 91.9;
          }
          if (id1 == "MEGHALAYA") {
            if (!isFullScreen) {
              stateName = "MG";
            }
            center.lat = 25.7;
            center.lng = 90.5;
          }
          if (id1 == "TRIPURA") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 23.5;
            center.lng = 90.5;
          }
          if (id1 == "NAGALAND") {
            if (!isFullScreen) {
              stateName = id1;
            }
            center.lat = 26.1;
            center.lng = 94.5;
          }
          if (id1 == "MIZORAM") {
            if (!isFullScreen) {
              stateName = "MZ";
            }
            center.lat = 23.1;
            center.lng = 92.9;
          }
          if (id1 == "MANIPUR") {
            if (!isFullScreen) {
              stateName = "MP";
            }
            center.lat = 24.5;
            center.lng = 92.3;
          }
          if (id1 == "ANDAMAN & NICOBAR ISLANDS (UT)") {
            if (!isFullScreen) {
              stateName = "A & N Islands (UT)";
            }
            center.lat = 9.8;
            center.lng = 91.7;
          }

          if (center.lat && center.lng) {
            const labelId = `label-${id1}`;
            // Check if a label with the same ID already exists and remove it
            const existingLabel = document.getElementById(labelId);
            if (existingLabel) {
              existingLabel.remove();
            }
            const label = L.marker([center.lat, center.lng], {
              icon: L.divIcon({
                className: "state-label",
                html: `
 
 <div id="${labelId}" style="font-size: ${
                  this.defaultFontSizeonMap
                }px; font-weight : 1000; color: #002467; width: 120px; text-align: center; white-space: nowrap;">
 <div>${stateName}</div>
 <div>${normalrainfall}</div>
 </div>
 `,
                iconSize: isFullScreen ? [50, 10] : [80, 10], // Adjusts the label position relative to the centroid
              }),
            }).addTo(this.map);
          }
        },
      }).addTo(this.map);
    });
  }

  // getColorForRainfall1(rainfall: any): string {
  //   const numericId = rainfall;
  //   let cat = "";
  //   let count = 0;

  //   if (numericId == null || numericId == " ") {
  //     return "#c0c0c0";
  //   }

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
  //   if (numericId > -100 && numericId < -59) {
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
