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
// import { CountryService } from 'src/app/services/country/country.service';
// import { MCRMCsService } from 'src/app/services/MC-RMCs/mcRmc.service';
import { MCRMCsServiceState } from "src/app/services/MC-RMCs/mcRmcState.service";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-rainfallmap-mc-rmc",
  templateUrl: "./rainfallmap-mc-rmc.component.html",
  styleUrls: ["./rainfallmap-mc-rmc.component.css"],
})
export class RainfallmapMcRmcComponent {
  districtdatacum: any[] = [];
  StartDate: any;
  EndDate: any;
  countrydatacum: any;
  countryActual: any;
  countryNormal: any;
  countryDeparture: any;
  isLoading = false;
  showHeader: boolean | undefined;
  displayMcName: any;
  today: any;
  allStateCodesinSelectedSet: any = new Set();

  fromDate: any = this.formatDate(new Date());
  toDate: any = this.formatDate(new Date());

  async downloadMapData() {
    this.isLoading = true;
    try {
      this.isLoading = true;
      await this.downloadPdf$.updateanddownloadpdf();
      this.isLoading = false;
    } catch (error) {
      console.error("Error downloading map data:", error);
    }
  }

  legendItems = [
    {
      color: "#0096ff",
      text: `Large Excess <br>[60% or more]`,
      fontSize: "9.3px",
    },
    { color: "#32c0f8", text: "Excess <br>[20% to 59%]", fontSize: "9.3px" },
    { color: "#00cd5b", text: "Normal <br>[-19% to 19%]", fontSize: "9.3px" },
    {
      color: "#ff2700",
      text: "Deficient <br>[-59% to -20%]",
      fontSize: "9.3px",
    },
    {
      color: "#ffff20",
      text: "Large Deficient <br>[-99% to -60%]",
      fontSize: "9.3px",
    },
    { color: "#ffffff", text: "No Rain <br>[-100%]", fontSize: "9.3px" },
    { color: "#c0c0c0", text: "No <br>Data", fontSize: "9.3px" },
  ];

  formatteddate: any;
  selectedDate: Date = new Date();
  inputValue: string = "";
  inputValue1: string = "";
  private initialZoom = 1;
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
    private downloadPdf$: DownloadPdf,
    private mcRMCService: MCRMCsServiceState,
    private router: Router // Inject Router
  ) {
    // Current date formatting
    const currentDate = new Date();
    const dd = String(currentDate.getDate()).padStart(2, "0");
    const mon = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = String(currentDate.getFullYear());
    this.formatteddate = `${dd}-${mon}-${year}`;

    // Fetch logged-in user data
    let loggedInUser: any = localStorage.getItem("isAuthorised");
    this.loggedInUserObject = JSON.parse(loggedInUser);
    console.log("loggedInUserObject for MC and RMC", this.loggedInUserObject);

    // Subscribe to router events to check the URL
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkUrl(); // Call the method to check URL
      });

    // Date subscription logic
    this.dataService.fromAndToDate$.subscribe((value) => {
      if (value) {
        let fromAndToDates = JSON.parse(value);
        this.StartDate = fromAndToDates.fromDate;
        this.EndDate = fromAndToDates.toDate;
        // console.log('inside if', this.StartDate, this.EndDate);
      } else {
        this.StartDate = `${year}-${mon}-${dd}`;
        this.EndDate = `${year}-${mon}-${dd}`;
        // console.log('inside else', this.StartDate, this.EndDate);

      }
      this.calculateInitialZoom();
      this.fetchBackend();
    });
  }

  private checkUrl() {
    // Check if 'allstatemaps' is in the current URL
    this.showHeader = this.router.url.includes("state-map-mc-rmc");
  }

  resetMapSmallScreen(): void {

    const zoomFactor = this.mcRMCService.getZoomFactor(this.selectedMcName);
    this.map.setView(
      this.mcRMCService.getCordinates(this.selectedMcName),
      zoomFactor
    );
  }

  convertToIndianDateFormat = (dateString: string) =>
    dateString.split("-").reverse().join("-");

  async fetchBackend() {
    const currentDate = new Date();
    const dd = String(currentDate.getDate()).padStart(2, "0");
    const mon = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = String(currentDate.getFullYear());
    
    const data = {
      startDate: this.fromDate,
      endDate: this.toDate,
    };
    // console.log(data.startDate, data.endDate);
    this.district.fetchDataFtp(data).subscribe((res) => {
      this.districtdatacum = res.data;
      console.log("fbdudusdubsudbsud", res.data);
      const url =
        this.mcRMCService.getMcRMCsJson()[this.loggedInUserObject.data[0].name]
          .url;
      this.loadGeoJSON(url);
      // console.log('called 176', this.StartDate, this.EndDate);
      this.StartDate = this.convertToIndianDateFormat(this.StartDate);
      this.EndDate = this.convertToIndianDateFormat(this.EndDate);
      // console.log(this.StartDate, this.EndDate);
      // this.onWindowResizer()
    });
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

    this.isLoading = true;

    try {
      const mapElement = document.getElementById(
        "map-MC-RMC-state-ftp_dup"
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
    this.selectedMcName = this.loggedInUserObject.data[0].name;
    this.displayMcName = this.selectedMcName.toUpperCase();
    this.listOfmsRMCs = [
      this.selectedMcName,
      ...this.listOfmsRMCs.filter((item: any) => item !== this.selectedMcName),
    ];
    this.onWindowResizer()
    this.initMap();
  }

  ngAfterViewInit(): void {
    // const url = this.mcRMCService.getMcRMCsJson()[this.loggedInUserObject.data[0].name].url
    // this.loadGeoJSON(url);
    // this.onWindowResize()
  }
  setFromAndToDate() {
    let data = {
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    this.StartDate = data.fromDate;
    this.EndDate = data.toDate
    // console.log('379 called', data.fromDate, data.toDate);
    this.formatteddate = this.fromDate.split("-").reverse().join("-")
    this.calculateInitialZoom()
    this.fetchBackend()
    // this.dataService.setfromAndToDate(JSON.stringify(data));
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
      console.log("selected state name", this.selectedMcName);
      this.calculateInitialZoom(
        this.mcRMCService.getZoomFactor(this.selectedMcName)
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
      // console.log('zoomfactor console', this.mcRMCService.getZoomFactor(this.selectedMcName))
      console.log("selected state name", this.selectedMcName);
      this.calculateInitialZoom(
        this.mcRMCService.getZoomFactor(this.selectedMcName)
      );

      // if (this.map) {
      //   this.map.setZoom(this.initialZoom);
      //   console.log('hii')
      //   this.map.setView([18, 78.9629], this.initialZoom);
      // }
    }
  }

  resetMap(): void {
    this.map.setView(
      this.mcRMCService.getCordinates(this.selectedMcName),
      this.initialZoom
    );
  }

  listOfmsRMCs: any = this.mcRMCService.getListOfMcRMCs();

  selectedUrl: string | null = null;
  selectedMcName: any = "";

  onSelectChange(event: Event): void {
    console.log(this.listOfmsRMCs);
    const target = event.target as HTMLSelectElement;
    this.selectedMcName = target.value;
    this.selectedUrl =
      this.mcRMCService.getMcRMCsJson()[this.selectedMcName].url || null;
    if (this.selectedUrl) {
      this.loadGeoJSON(this.selectedUrl);
    }
    this.onWindowResize();
  }

  private initMap(): void {


    const coordinates = this.mcRMCService.getCordinates(this.selectedMcName);
    const zoomFactor = this.mcRMCService.getZoomFactor(this.selectedMcName);

    this.map = L.map("map-MC-RMC-state-ftp_dup", {
      center: coordinates,
      zoom: zoomFactor,
      scrollWheelZoom: false,
      zoomSnap: 0.1,
      zoomDelta: 0.1,
      zoomControl: false, 
      doubleClickZoom: false, 
      boxZoom: false, 
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
      console.log("callled 420", this.districtLayer);
      this.map.removeLayer(this.districtLayer);
    }

    console.log(httpUrl);
    const urlsToUse = Array.isArray(httpUrl) ? httpUrl : [httpUrl];

    urlsToUse.forEach((url) => {
      this.http.get(url).subscribe((res: any) => {
        const mcDetails =
          this.mcRMCService.getMcRMCsJson()?.[this.selectedMcName];

        if (!mcDetails || !mcDetails.url) {
          console.error("No GeoJSON URL found for the selected MC.");
          return;
        }

        // Ensure mcDetails.url is treated as an array
        const urls = Array.isArray(mcDetails.url)
          ? mcDetails.url
          : [mcDetails.url];
        const districtLayers: L.LayerGroup = L.layerGroup().addTo(this.map);

        let allBounds = L.latLngBounds([]);

        urls.forEach((geoJsonUrl: string) => {
          this.http.get(geoJsonUrl).subscribe((geoJsonData: any) => {
            const layer = L.geoJSON(geoJsonData, {
              style: (feature: any) => {
                const id2 = feature.properties["district_c"];
                this.allStateCodesinSelectedSet.add(feature.properties["state_code"].toString().split('').filter((_: any, i: number) => i !== 1 && i !== 2).join(''))
                const matchedData = this.findMatchingData(id2);
                let rainfall: any =
                  matchedData && !Number.isNaN(matchedData.actual_rainfall)
                    ? matchedData.departure
                    : " ";
                const color = this.getColorForRainfall1(rainfall);

                return {
                  fillColor: color,
                  weight: 1,
                  opacity: 1.5,
                  color: "black",
                  fillOpacity: 1,
                };
              },
              onEachFeature: (feature: any, layer: any) => {
                const popupContent = this.generatePopupContent(feature);
                layer.bindPopup(popupContent);
                layer.on("mouseover", () => layer.openPopup());
                layer.on("mouseout", () => layer.closePopup());
              },
            });

            districtLayers.addLayer(layer);

            // Update bounds with the current layer's bounds
            if (layer.getBounds) {
              allBounds = allBounds.extend(layer.getBounds());
            }
          });
        });

        // Once all layers are added, fit the map to the bounds
        // setTimeout(() => {
        //   if (districtLayers.getLayers().length > 0) {
        //     this.map.fitBounds(allBounds);
        //   } else {
        //     console.warn('No layers found in the LayerGroup to fit bounds.');
        //   }
        // }, 5000);

        this.districtLayer = districtLayers; // Save reference to the combined layer group
      });
    });

    console.log("loading is successful");
  }

  private generatePopupContent(feature: any): string {
    const state = feature.properties.state;
    const id1 = feature.properties["district"];
    const id2 = feature.properties["district_c"];
    const matchedData = this.findMatchingData(id2);
    const dailyrainfall =
      matchedData &&
      matchedData.actual_rainfall !== null &&
      matchedData.actual_rainfall !== undefined &&
      !Number.isNaN(matchedData.actual_rainfall)
        ? matchedData.actual_rainfall.toFixed(1) + " mm"
        : "NA";
    const normalrainfall =
      matchedData && !Number.isNaN(matchedData.normal_rainfall)
        ? parseFloat(matchedData.normal_rainfall).toFixed(1) + " mm"
        : "NA";
    const departure = matchedData ? Math.round(matchedData.departure) : "NA";

    return `
      <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
        <div style="color: #002467; font-weight: bold; font-size: 13px;">STATE: ${state}</div>
        <div style="color: #002467; font-weight: bold; font-size: 13px;">DISTRICT: ${id1}</div>
        <div style="color: #002467; font-weight: bold; font-size: 13px;">DAILY RAINFALL: ${dailyrainfall}</div>
        <div style="color: #002467; font-weight: bold; font-size: 13px;">NORMAL RAINFALL: ${normalrainfall}</div>
        <div style="color: #002467; font-weight: bold; font-size: 13px;">DEPARTURE: ${departure} %</div>
      </div>
    `;
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
      "#logoImage-MC-RMC-State"
    );
    const Header = this.elRef.nativeElement.querySelector(
      "#middle-header-MC-RMC-state"
    );
    const directionCompass = this.elRef.nativeElement.querySelector(
      "#compassArrow-MC-RMC-state"
    );
    // const btn = this.elRef.nativeElement.querySelector('#all-btn-district');
    const resetButton = this.elRef.nativeElement.querySelector(
      "#resetButton-MC-RMC-state"
    );

    let legendsColor = this.elRef.nativeElement.querySelector(
      "#leaflet-bottom-MC-RMC-state"
    );
    const celebrations = this.elRef.nativeElement.querySelector(
      "#celebrations-MC-RMC-state"
    );
    // const country_val = this.elRef.nativeElement.querySelector('#country_values-district')
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

      // this.renderer.setStyle(country_val, 'position', 'absolute');
      // this.renderer.setStyle(country_val, 'left', '53%');
      // this.renderer.setStyle(country_val, 'top', '65%');

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

      // this.renderer.removeStyle(country_val, 'position');
      // this.renderer.removeStyle(country_val, 'left');
      // this.renderer.removeStyle(country_val, 'top');

      this.renderer.removeStyle(resetButton, "position");
      this.renderer.removeStyle(resetButton, "left");
      this.renderer.removeStyle(resetButton, "top");
    }
  }

  getColorForRainfall1(rainfall: any): string {
    if (rainfall == null || rainfall == " ") {
      return "#c0c0c0";
    }

    const numericId = Math.round(rainfall);
    console.log("color", numericId);
    let cat = "";
    let count = 0;

    if (numericId >= 60) {
      cat = "LE";
      return "#0393ff";
    }
    if (numericId >= 20 && numericId < 60) {
      cat = "E";
      return "#69bef7";
    }
    if (numericId >= -19 && numericId < 20) {
      cat = "N";
      return "#68dd58";
    }
    if (numericId >= -59 && numericId < -19) {
      cat = "D";
      return "#fb4111";
    }
    if (numericId >= -99 && numericId < -59) {
      cat = "LD";
      return "#ffff00";
    }

    if (numericId == -100) {
      cat = "NR";
      count = count + 1;
      return "#ffffff";
    } else {
      cat = "ND";
      return "#c0c0c0";
    }
  }
}
