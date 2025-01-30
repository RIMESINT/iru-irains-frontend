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
import { SubdivisionService } from "src/app/services/subDivision/subDivision.service";
import { SubdivDownloadStatistics } from "src/app/services/subDivision/statisticsdownload.service";
import jsPDF from "jspdf";
import { CountryDownloadStatistics } from "src/app/services/country/pdfStatisticsDownloadCountry.service";
import { CountryService } from "src/app/services/country/country.service";
import { Constants } from "src/app/services/constants";

@Component({
  selector: "app-normal-map-subdiv",
  templateUrl: "./normal-map-subdiv.component.html",
  styleUrls: ["./normal-map-subdiv.component.css"],
})
export class NormalMapSubdivComponent implements AfterViewInit {
  subdivisiondatacum: any[] = [];
  countrydatacum: any;
  countryActual: any;
  countryNormal: any;
  countryDeparture: any;
  isLoading: boolean = false;

  @Input() mapData: any;
  @Input() selectedSeason: string = "";
  @Input() dateRange: string = "";
  @Input() selectedMap: string = "";

  async downloadMapData() {
    this.isLoading = true;
    try {
      this.isLoading = true;
      await this.downlaodStatistics.updateanddownloadpdf();
      this.isLoading = false;
    } catch (error) {
      console.error("Error downloading map data:", error);
    }
  }

  @Input() fromDate: any;
  @Input() endDate: any;

  legendItems: any[] = [];

  // Define the legend items for each season in a single object
  private seasonLegendItems: any = {
    Winter: {
      State: [
        { color: "#effaa2", text: "0 - 10", fontSize: "1rem" },
        { color: "#f9ff00", text: "11 - 40", fontSize: "1rem" },
        { color: "#B7FF7E", text: "41 - 100", fontSize: "1rem" },
        { color: "#00cd5b", text: "101 - 150", fontSize: "1rem" },
        { color: "#00B9C1", text: "> 150", fontSize: "1rem" },
      ],
      Subdivision: [
        { color: "#e7e600", text: "0 - 10", fontSize: "1rem" },
        { color: "#fc8b01", text: "11 - 50", fontSize: "1rem" },
        { color: "#4de600", text: "51 - 100", fontSize: "1rem" },
        { color: "#03c5ff", text: "101 - 150", fontSize: "1rem" },
        { color: "#0171fe", text: "> 150", fontSize: "1rem" },
      ],
    },
    "Pre Monsoon": {
      State: [
        { color: "#effaa2", text: "0 - 50", fontSize: "1rem" },
        { color: "#f89700", text: "51 - 150", fontSize: "1rem" },
        { color: "#00B9C1", text: "151 - 250", fontSize: "1rem" },
        { color: "#00a4e6", text: "251 - 500", fontSize: "1rem" },
        { color: "#0018e6", text: "> 500", fontSize: "1rem" },
      ],
      Subdivision: [
        { color: "#effaa2", text: "0 - 50", fontSize: "1rem" },
        { color: "#f89700", text: "51 - 100", fontSize: "1rem" },
        { color: "#32CD32", text: "101 - 300", fontSize: "1rem" },
        { color: "#00a4e6", text: "301 - 500", fontSize: "1rem" },
        { color: "#0034a6", text: "> 500", fontSize: "1rem" },
      ],
    },
    Monsoon: {
      State: [
        { color: "#effaa3", text: "20 - 500", fontSize: "1rem" },
        { color: "#f79800", text: "501 - 1000", fontSize: "1rem" },
        { color: "#335701", text: "1001 - 1500", fontSize: "1rem" },
        { color: "#00a5e6", text: "1501 - 2500", fontSize: "1rem" },
        { color: "#0034a6", text: "> 2500", fontSize: "1rem" },
      ],
      Subdivision: [
        { color: "#effaa2", text: "250 - 500", fontSize: "1rem" },
        { color: "#f89700", text: "501 - 800", fontSize: "1rem" },
        { color: "#32CD32", text: "801 - 1500", fontSize: "1rem" },
        { color: "#00a4e6", text: "1501 - 2500", fontSize: "1rem" },
        { color: "#0034a6", text: "> 2500", fontSize: "1rem" },
      ],
    },
    "Post Monsoon": {
      State: [
        { color: "#effaa2", text: "0 - 100", fontSize: "1rem" },
        { color: "#f89700", text: "101 - 200", fontSize: "1rem" },
        { color: "#335701", text: "201 - 300", fontSize: "1rem" },
        { color: "#00a4e6", text: "301 - 500", fontSize: "1rem" },
        { color: "#0034a6", text: "> 500", fontSize: "1rem" },
      ],
      Subdivision: [
        { color: "#effaa3", text: "0 - 50", fontSize: "1rem" },
        { color: "#f79800", text: "51 - 100", fontSize: "1rem" },
        { color: "#32CD32", text: "101 - 200", fontSize: "1rem" },
        { color: "#00a5e6", text: "201 - 400", fontSize: "1rem" },
        { color: "#0034a6", text: "> 400", fontSize: "1rem" },
      ],
    },

    Annual: {
      State: [
        { color: "#f2f1a1", text: "50 - 1000", fontSize: "1rem" },
        { color: "#e69803", text: "1001 - 1500", fontSize: "1rem" },
        { color: "#39a700", text: "1501 - 2000", fontSize: "1rem" },
        { color: "#05a8e6", text: "2001 - 3000", fontSize: "1rem" },
        { color: "#004da7", text: "> 3000", fontSize: "1rem" },
      ],
      Subdivision: [
        { color: "#f2f1a1", text: "320 - 500", fontSize: "1rem" },
        { color: "#e69803", text: "501 - 1000", fontSize: "1rem" },
        { color: "#39a700", text: "1001 - 2000", fontSize: "1rem" },
        { color: "#05a8e6", text: "2001 - 3000", fontSize: "1rem" },
        { color: "#004da7", text: "> 3000", fontSize: "1rem" },
      ],
    },

    // Add for other seasons and map types in similar format...
  };

  // legendItems = [
  // {
  // color: "#e7e600",
  // text: `0 - 10`,
  // fontSize: "1rem",
  // },

  // { color: "#fc8b01",
  // text: "11 - 50",
  // fontSize: "1rem"
  // },

  // { color: "#4de600",
  // text: "51 - 100",
  // fontSize: "1rem"
  // },

  // {
  // color: "#03c5ff",
  // text: "101 - 150",
  // fontSize: "1rem",
  // },

  // {
  // color: "#0171fe",
  // text: "> 150",
  // fontSize: "1rem",
  // },
  // ];

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
    private subdivisionService: SubdivisionService,
    private downlaodStatistics: SubdivDownloadStatistics,
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
      // this.fetchBackend();
    });
  }

  ngOnChanges() {
    // Called whenever mapData input is updated
    console.log("ngOnChanges selectedSeason", this.selectedSeason);
    console.log("ngOnChanges MAP", this.selectedMap);

    // Update legendItems dynamically based on the selected season
    this.updateLegendItems();

    if (this.mapData) {
      console.log("Received map data STATE:", this.mapData);
      this.subdivisiondatacum = this.mapData.data; // Adjust this based on the response structure
      this.loadGeoJSON(false);
    }
  }

  // Method to update legend items based on the selected season
  updateLegendItems() {
    // Access the legendItems for the selected season and map, or set to an empty array if not found
    const seasonMapLegend = this.seasonLegendItems[this.selectedSeason];
    this.legendItems =
      (seasonMapLegend && seasonMapLegend[this.selectedMap]) || [];
  }

  convertToIndianDateFormat = (dateString: string) =>
    dateString.split("-").reverse().join("-");

  // async fetchBackend() {
  // const currentDate = new Date();
  // const dd = String(currentDate.getDate()).padStart(2, "0");
  // const mon = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  // const year = String(currentDate.getFullYear());

  // const data = {
  // startDate: this.StartDate || `${year}-${mon}-${dd}`,
  // endDate: this.EndDate || `${year}-${mon}-${dd}`,
  // };
  // this.subdivisionService.fetchDataFtp(data).subscribe((res) => {
  // this.statedatacum = res.data;
  // console.log("balu....", this.statedatacum);
  // this.loadGeoJSON(false);
  // this.StartDate = this.convertToIndianDateFormat(this.StartDate);
  // this.EndDate = this.convertToIndianDateFormat(this.EndDate);
  // });
  // this.countryService.fetchDataFtp(data).subscribe((res) => {
  // this.countrydatacum = res.data;
  // this.countryActual = this.constants.trimToOneDecimals(
  // this.countrydatacum[0].actual_rainfall
  // );
  // this.countryNormal = this.constants.trimToOneDecimals(
  // parseFloat(this.countrydatacum[0].rainfall_normal_value)
  // );
  // this.countryDeparture = Math.round(this.countrydatacum[0].departure);
  // console.log(
  // "country dep data",
  // this.countrydatacum,
  // this.countryActual,
  // this.countryDeparture,
  // this.countryNormal
  // );
  // });
  // }

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
    const matchedData = this.subdivisiondatacum?.find((data: any) => {
      return data.s_code === id;
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
        "map-normal-subdiv-ftp"
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
        link.download = "SUBDIVISION_RAINFALL_MAP_COUNTRY_INDIA_cd.jpeg";
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
          link.download = "SUBDIVISION_RAINFALL_MAP_COUNTRY_INDIA_cd.jpeg";
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
      pdf.save("SUBDIVISION_RAINFALL_MAP_COUNTRY_INDIA_cd.pdf");
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
    // this.defaultFontSizeonMap = (this.initialZoom+1)*2
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
    this.map.setView([24, 80.9629], this.initialZoom + 1);
  }

  resetMapSmallScreen(): void {
    this.map.setView([24, 81.9629], this.initialZoom);
  }

  private initMap(): void {
    this.map = L.map("map-normal-subdiv-ftp", {
      center: [24, 81.9629],
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
      "#logoImage-subdiv-normal-map"
    );
    const Header = this.elRef.nativeElement.querySelector(
      "#logoImage-subdiv-normal-map"
    );
    const directionCompass = this.elRef.nativeElement.querySelector(
      "#compassArrow-subdiv-normal-map"
    );
    const legendsColor = this.elRef.nativeElement.querySelector(
      "#leaflet-bottom-subdiv-normal-map"
    );
    const resetButton = this.elRef.nativeElement.querySelector(
      "#resetButton-normal-map-subdiv"
    );

    // const iRainsLogoImage = this.elRef.nativeElement.querySelector('#logo-irains-img')
    const celebrations = this.elRef.nativeElement.querySelector(
      "#celebrations-subdiv-normal-map"
    );
    // const fullscreenInfo = this.elRef.nativeElement.querySelector("#fullscreen-info")
    const country_val = this.elRef.nativeElement.querySelector(
      "#country_values-subdiv-normal-map"
    );

    const borderRemove = this.elRef.nativeElement.querySelector(
      "#border-remove-subdiv-normal-map"
    );

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
        this.renderer.addClass(borderRemove, "no-border");
      }
    } else {
      this.map.removeControl(this.map.zoomControl);
      this.map.dragging.disable();

      this.renderer.removeClass(borderRemove, "no-border");
      this.renderer.setStyle(borderRemove, "border", "2px solid black");

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
    this.http
      .get("assets/geojson/INDIA_SUB_DIVISION.json")
      .subscribe((res: any) => {
        const districtLayer = L.geoJSON(res, {
          style: (feature: any) => {
            const id2 = feature.properties["SubDiv_Cod"];
            const matchedData = this.findMatchingData(id2);
            // console.log('matchedData',matchedData)
            let rainfall: any;

            if (matchedData?.departure!=null) {
              rainfall = matchedData.departure;
            } else {
              rainfall = "NA";
            }
  
            const color = this.getColorForRainfall1(matchedData);

            return {
              // fillColor: color,
              // weight: 1,
              // opacity: 1.5,
              // color: 'black',
              // fillOpacity: 100
              fillColor: color,
              weight: 1,
              opacity: 0.3, //1.5
              color: "black",
              fillOpacity: 100,
            };
          },
          onEachFeature: (feature: any, layer: any) => {
            let id1 = feature.properties["subdivisio"];
            let id2 = feature.properties["SubDiv_Cod"];
            // console.log('SUBDIV ID' , id2)
            const matchedData = this.findMatchingData(id2);
            // console.log('matchedData', matchedData)
            let rainfall: any;
          
            if (matchedData?.departure!=null) {

              rainfall = this.constants.trimToZeroDecimals(matchedData.departure);
            } else {
  
              rainfall = "NA";
            }

            const dailyrainfall =
              matchedData &&
              matchedData.actual_subdiv_rainfall !== null &&
              matchedData.actual_subdiv_rainfall != undefined &&
              !Number.isNaN(matchedData.actual_subdiv_rainfall)
                ? this.constants.trimToOneDecimals(
                    matchedData.actual_subdiv_rainfall
                  )
                : "NA";
            const normalrainfall =
              matchedData && !Number.isNaN(matchedData.rainfall_normal_value)
                ? this.constants.trimToOneDecimals(
                    parseFloat(matchedData.rainfall_normal_value)
                  ) + " mm"
                : "NA";

            // Determine label position and abbreviation
            let center = {
              lat: feature.properties["lat"],
              lng: feature.properties["lng"],
            };

            if (id1 == "ARUNACHAL PRADESH") {
              // if(!isFullScreen){
              id1 = "AR";
              // }
              // id1 = "AR"
              center.lat = 28;
              center.lng = 96.5;
            }
            if (id1 == "ASSAM & MEGHALAYA") {
              // if(!isFullScreen){
              id1 = "AS & ML";
              // }
              // id1 = "AS & ML"
              center.lat = 26.5;
              center.lng = 93.9;
            }
            if (id1 == "NL & MN & MZ & TR") {
              // id1 = "NL & MN & MZ & TR"
              center.lat = 23.5;
              center.lng = 94;
            }
            if (id1 == "SHWB & SIKKIM") {
              // if(!isFullScreen){
              id1 = "SHWB & SK";
              // }
              // id1 = "SHWB & SK"
              center.lat = 27.5;
              center.lng = 89.5;
            }

            if (id1 == "GANGETIC WEST BENGAL") {
              // if(!isFullScreen){
              id1 = "G-WB";
              // }

              // id1 = "G-WB"
              center.lat = 22.5;
              center.lng = 89;
            }
            if (id1 == "JHARKHAND") {
              // if(!isFullScreen){
              id1 = "JH";
              // }
              // id1 = "JH"
              center.lat = 23;
              center.lng = 86;
            }
            if (id1 == "BIHAR") {
              // if(!isFullScreen){
              id1 = "BR";
              // }
              // id1 = "BR"
              center.lat = 25.5;
              center.lng = 87;
            }
            if (id1 == "EAST UTTAR PRADESH") {
              // if(!isFullScreen){
              id1 = "E-UP";
              // }
              // id1 = "E-UP"
              center.lat = 27.2;
              center.lng = 82.8;
            }
            if (id1 == "WEST UTTAR PRADESH") {
              // if(!isFullScreen){
              id1 = "W-UP";
              // }
              // id1 = "W-UP"
              center.lat = 28;
              center.lng = 80;
            }
            if (id1 == "UTTARAKHAND") {
              // if(!isFullScreen){
              id1 = "UK";
              // }
              // id1 = "UK"
              center.lat = 30.8;
              center.lng = 80.3;
            }
            if (id1 == "DELHI, HARYANA AND CHANDIGARH") {
              // if(!isFullScreen){
              id1 = "DL & HR & CD";
              // }
              // id1 = "DL & HR & CD"
              center.lat = 28.8;
              center.lng = 77.1;
            }
            if (id1 == "PUNJAB") {
              // if(!isFullScreen){
              id1 = "PB";
              // }
              // id1 = "PB"
              center.lat = 31.3;
              center.lng = 76.5;
            }
            if (id1 == "HIMACHAL PRADESH") {
              // if(!isFullScreen){
              id1 = "HP";
              // }
              // id1 = "HP"
              center.lat = 32.7;
              center.lng = 78.3;
            }

            if (id1 == "JAMMU & KASHMIR AND LADAKH") {
              // if(!isFullScreen){
              id1 = "JK & LD";
              // }
              // id1 = "JK & LA"
              center.lat = 34;
              center.lng = 77.5;
            }
            if (id1 == "WEST RAJASTHAN") {
              // if(!isFullScreen){
              id1 = "W-RJ";
              // }
              // id1 = "W-RJ"
              center.lat = 27;
              center.lng = 73.5;
            }

            if (id1 == "EAST RAJASTHAN") {
              // if(!isFullScreen){
              id1 = "E-RJ";
              // }
              // id1 = "E-RJ"
              center.lat = 26.4;
              center.lng = 76;
            }
            if (id1 == "ODISHA") {
              // if(!isFullScreen){
              id1 = "OD";
              // }
              // id1 = "OD"
              center.lat = 20.5;
              center.lng = 85.7;
            }
            if (id1 == "WEST MADHYA PRADESH") {
              // if(!isFullScreen){
              id1 = "W-MP";
              // }
              // id1 = "W-MP"
              center.lat = 24;
              center.lng = 78;
            }
            if (id1 == "EAST MADHYA PRADESH") {
              // if(!isFullScreen){
              id1 = "E-MP";
              // }
              // id1 = "E-MP"
              center.lat = 23.9;
              center.lng = 81.5;
            }
            if (id1 == "GUJARAT REGION") {
              // if(!isFullScreen){
              id1 = "GJ";
              // }
              // id1 = "GJ"
              center.lat = 23.5;
              center.lng = 73.8;
            }
            if (id1 == "SAURASHTRA & KUTCH") {
              // if(!isFullScreen){
              id1 = "SR & KT";
              // }
              // id1 = "SR & KT"
              center.lat = 23;
              center.lng = 71.3;
            }
            if (id1 == "KONKAN & GOA") {
              // if(!isFullScreen){
              id1 = "KN & GA";
              // }
              // id1 = "KN & GA"
              center.lat = 19.5;
              center.lng = 74;
            }
            if (id1 == "MADHYA MAHARASHTRA") {
              // if(!isFullScreen){
              id1 = "M-MH";
              // }

              // id1 = "M-MH"
              center.lat = 17.9;
              center.lng = 75.3;
            }
            if (id1 == "MARATHWADA") {
              // if(!isFullScreen){
              id1 = "MT";
              // }
              // id1 = "MT"
              center.lat = 19.7;
              center.lng = 77;
            }
            if (id1 == "VIDARBHA") {
              // if(!isFullScreen){
              id1 = "VD";
              // }
              // id1 = "VD"
              center.lat = 21;
              center.lng = 79;
            }
            if (id1 == "CHHATTISGARH") {
              // if(!isFullScreen){
              id1 = "CG";
              // }
              // id1 = "CG"
              center.lat = 22;
              center.lng = 83;
            }
            if (id1 == "ANDAMAN & NICOBAR ISLANDS") {
              // if(!isFullScreen){
              id1 = "AN";
              // }
              // id1 = "AN"
              center.lat = 9.8;
              center.lng = 94;
            }
            if (id1 == "COASTAL ANDHRA PRADESH & YANAM") {
              // if(!isFullScreen){
              id1 = "C-AP & YN";
              // }
              // id1 = "C-AP & YN"
              center.lat = 15.5;
              center.lng = 82.5;
            }
            if (id1 == "TELANGANA") {
              // if(!isFullScreen){
              id1 = "TS";
              // }
              // id1 = "TS"
              center.lat = 17.5;
              center.lng = 80;
            }
            if (id1 == "RAYALSEEMA") {
              // if(!isFullScreen){
              id1 = "RS";
              // }
              // id1 = "RS"
              center.lat = 15;
              center.lng = 79;
            }
            if (id1 == "TAMILNADU, PUDUCHERRY & KARAIKAL") {
              // if(!isFullScreen){
              id1 = "TN & PY & KR";
              // }
              // id1 = "TN & PY & KR"

              center.lat = 11.1;
              center.lng = 80;
            }
            if (id1 == "COASTAL KARNATAKA") {
              // if(!isFullScreen){
              id1 = "C-KA";
              // }
              // id1 = "C-KA"
              center.lat = 15;
              center.lng = 74.7;
            }
            if (id1 == "NORTHERN INTERIOR KARNATAKA") {
              // if(!isFullScreen){
              id1 = "NI-KA";
              // }
              // id1 = "NI-KA"
              center.lat = 16;
              center.lng = 77;
            }
            if (id1 == "SOUTHERN INTERIOR KARNATAKA") {
              // if(!isFullScreen){
              id1 = "SI-KA";
              // }
              // id1 = "SI-KA"
              center.lat = 13.5;
              center.lng = 78;
            }
            if (id1 == "KERALA & MAHE") {
              // if(!isFullScreen){
              id1 = "KL & ME";
              // }
              // id1 = "KL & ME"
              center.lat = 10.4;
              center.lng = 77;
            }
            if (id1 == "LAKSHADWEEP") {
              // if(!isFullScreen){
              id1 = "LD";
              // }
              // id1 = "LD"
              center.lat = 10.8;
              center.lng = 73.5;
            }
            if (center.lat && center.lng) {
              const labelId = `label-${id2}`;

              const existingLabel = document.getElementById(labelId);
              if (existingLabel) {
                existingLabel.remove();
              }

              const label = L.marker([center.lat, center.lng], {
                icon: L.divIcon({
                  className: "state-label",
                  html: `
 <div id="${labelId}" style="font-size: ${this.defaultFontSizeonMap}px; font-weight : 1000; color: #002467; width: 120px; text-align: center; white-space: nowrap;">
 <div>${id1}</div>
 <div>${normalrainfall}</div>
 </div>
 `,
                  iconSize: isFullScreen ? [210, 40] : [150, 10], // Adjusts the label position relative to the centroid
                }),
              }).addTo(this.map);
            }
          },
        }).addTo(this.map);
      });
  }

  getColorForRainfall1(rainfall: any): string {
    const numericId = rainfall?.rainfall_normal_value;
    console.log("getColorForRainfall1 fn SEASON", this.selectedSeason);
    console.log("getColorForRainfall1 fn MAP", this.selectedMap);
    // console.log('clg 889', numericId);

    let cat = "";
    let count = 0;
    // if (numericId == null || numericId == " ") {
    // return "#c0c0c0";
    // }

    if (this.selectedSeason == "Winter" && this.selectedMap == "State") {
      if (numericId >= 0 && numericId <= 10) {
        cat = "LE";
        return "#effaa2";
      }
      if (numericId >= 11 && numericId <= 40) {
        cat = "E";
        return "#f9ff00";
      }
      if (numericId >= 41 && numericId <= 100) {
        cat = "N";
        return "#B7FF7E";
      }
      if (numericId >= 101 && numericId <= 150) {
        cat = "D";
        return "#00cd5b";
      }
      if (numericId > 150) {
        cat = "LD";
        return "#00B9C1";
      }

      return "#c0c0c0";
    }

    if (this.selectedSeason == "Winter" && this.selectedMap == "Subdivision") {
      if (numericId >= 0 && numericId <= 10.99) {
        cat = "LE";
        return "#e7e600";
      }
      if (numericId >= 11 && numericId <= 50) {
        cat = "E";
        return "#fc8b01";
      }
      if (numericId >= 51 && numericId <= 100) {
        cat = "N";
        return "#4de600";
      }
      if (numericId >= 101 && numericId <= 150) {
        cat = "D";
        return "#03c5ff";
      }
      if (numericId > 150) {
        cat = "LD";
        return "#0171fe";
      }

      return "#c0c0c0";
    }

    if (this.selectedSeason == "Pre Monsoon" && this.selectedMap == "State") {
      if (numericId >= 0 && numericId <= 50) {
        cat = "LE";
        return "#effaa2";
      }
      if (numericId >= 51 && numericId <= 150) {
        cat = "E";
        return "#f89700";
      }
      if (numericId >= 151 && numericId <= 250) {
        cat = "N";
        return "#00B9C1";
      }
      if (numericId >= 251 && numericId <= 500) {
        cat = "D";
        return "#00a4e6";
      }
      if (numericId > 500) {
        cat = "LD";
        return "#0018e6";
      }

      return "#c0c0c0";
    }

    if (
      this.selectedSeason == "Pre Monsoon" &&
      this.selectedMap == "Subdivision"
    ) {
      if (numericId >= 0 && numericId <= 50) {
        cat = "LE";
        return "#effaa2";
      }
      if (numericId >= 51 && numericId <= 100) {
        cat = "E";
        return "#f89700";
      }
      if (numericId >= 101 && numericId <= 300) {
        cat = "N";
        return "#32CD32";
      }
      if (numericId >= 301 && numericId <= 500) {
        cat = "D";
        return "#00a4e6";
      }
      if (numericId > 500) {
        cat = "LD";
        return "#0034a6";
      }

      return "#c0c0c0";
    }

    if (this.selectedSeason == "Monsoon" && this.selectedMap == "State") {
      if (numericId >= 20 && numericId <= 500) {
        cat = "LE";
        return "#effaa3";
      }
      if (numericId >= 501 && numericId <= 1000) {
        cat = "E";
        return "#f79800";
      }
      if (numericId >= 1001 && numericId <= 1500) {
        cat = "N";
        return "#335701";
      }
      if (numericId >= 1501 && numericId <= 2500) {
        cat = "D";
        return "#00a5e6";
      }
      if (numericId > 2500) {
        cat = "LD";
        return "#0034a6";
      }

      return "#c0c0c0";
    }

    if (this.selectedSeason == "Monsoon" && this.selectedMap == "Subdivision") {
      if (numericId >= 250 && numericId <= 500) {
        cat = "LE";
        return "#effaa2";
      }
      if (numericId >= 501 && numericId <= 800) {
        cat = "E";
        return "#f89700";
      }
      if (numericId >= 801 && numericId <= 1500) {
        cat = "N";
        return "#32CD32";
      }
      if (numericId >= 1501 && numericId <= 2500) {
        cat = "D";
        return "#00a4e6";
      }
      if (numericId > 2500) {
        cat = "LD";
        return "#0034a6";
      }

      return "#c0c0c0";
    }

    if (this.selectedSeason == "Post Monsoon" && this.selectedMap == "State") {
      if (numericId >= 0 && numericId <= 100) {
        cat = "LE";
        return "#effaa2";
      }
      if (numericId >= 101 && numericId <= 200) {
        cat = "E";
        return "#f89700";
      }
      if (numericId >= 201 && numericId <= 300) {
        cat = "N";
        return "#335701";
      }
      if (numericId >= 301 && numericId <= 500) {
        cat = "D";
        return "#00a4e6";
      }
      if (numericId > 500) {
        cat = "LD";
        return "#0034a6";
      }

      return "#c0c0c0";
    }

    if (
      this.selectedSeason == "Post Monsoon" &&
      this.selectedMap == "Subdivision"
    ) {
      if (numericId >= 0 && numericId <= 50) {
        cat = "LE";
        return "#effaa3";
      }
      if (numericId >= 51 && numericId <= 100) {
        cat = "E";
        return "#f79800";
      }
      if (numericId >= 101 && numericId <= 200) {
        cat = "N";
        return "#32CD32";
      }
      if (numericId >= 201 && numericId <= 400) {
        cat = "D";
        return "#00a5e6";
      }
      if (numericId > 400) {
        cat = "LD";
        return "#0034a6";
      }

      return "#c0c0c0";
    }

    if (this.selectedSeason == "Annual" && this.selectedMap == "State") {
      if (numericId >= 50 && numericId <= 1000) {
        cat = "LE";
        return "#f2f1a1";
      }
      if (numericId >= 1001 && numericId <= 1500) {
        cat = "E";
        return "#e69803";
      }
      if (numericId >= 1501 && numericId <= 2000) {
        cat = "N";
        return "#39a700";
      }
      if (numericId >= 2001 && numericId <= 3000) {
        cat = "D";
        return "#05a8e6";
      }
      if (numericId > 3000) {
        cat = "LD";
        return "#004da7";
      }

      return "#c0c0c0";
    }

    if (this.selectedSeason == "Annual" && this.selectedMap == "Subdivision") {
      if (numericId >= 320 && numericId <= 500) {
        cat = "LE";
        return "#f2f1a1";
      }
      if (numericId >= 501 && numericId <= 1000) {
        cat = "E";
        return "#e69803";
      }
      if (numericId >= 1001 && numericId <= 2000) {
        cat = "N";
        return "#39a700";
      }
      if (numericId >= 2001 && numericId <= 3000) {
        cat = "D";
        return "#05a8e6";
      }
      if (numericId > 3000) {
        cat = "LD";
        return "#004da7";
      }

      return "#c0c0c0";
    }

    return "#c0c0c0";
  }
}
