import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EMPTY, Observable, concatMap, lastValueFrom, of } from "rxjs";
import { environment } from "src/environment/environment";
import { Constants } from "../constants";
import autoTable, { Column } from "jspdf-autotable";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { RegionService } from "../region/region.service";
import { content } from "html2canvas/dist/types/css/property-descriptors/content";
import { sub } from "date-fns";
import { DistrictService } from "./district.service";

@Injectable({
  providedIn: "root",
})
export class DistrictRainFallDeparture {
  private baseUrl: string = environment.baseUrl;
  isView: boolean = false;

  districtdepCurrdate: any[] = [];

  rows: any[][] = [];
  allData: any[] = [];

  constructor(
    private http: HttpClient,
    private constants: Constants,
    private districtservice : DistrictService
  ) {
    
  }

  async updateAndShowFromFTP(weeks: any[]) {

    // this.allData = []

    // const promises = weeks.map(async (week) => {
    //   const data = {
    //     startDate: week.startDate,
    //     endDate: week.endDate,
    //   };

    //   await this.updateCurrDateDataFromFtp(data);
    //   this.allData.push(this.districtdepCurrdate);
    // });

    // await Promise.all(promises);
    // console.log("All data from FTP:", this.allData);
    // this.loadtheRows();
    // return this.rows






    this.allData = []; // Reset data array
  
    // Use Promise.all to ensure all data is fetched before processing
    const results = await Promise.all(
      weeks.map(async (week) => {
        const data = {
          startDate: week.startDate,
          endDate: week.endDate,
        };
        const districtData = await this.updateCurrDateDataFromFtp(data);
        return { week, districtData }; 
      })
    );
  
    // Sort results to ensure correct order by the week (if necessary)
    results.sort((a, b) => new Date(a.week.startDate).getTime() - new Date(b.week.startDate).getTime());
  
    // Extract the data in the correct order
    this.allData = results.map((result) => result.districtData);
  
    console.log("All data from FTP:", this.allData);
    this.loadtheRows(); // Process the rows after all data is loaded
    return this.rows;
  }



  async updateCurrDateDataFromFtp(data: any) {

    try {
      const subdivData = await lastValueFrom(
        this.districtservice.fetchDataFtp(data).pipe(
          concatMap((subdiv) => {
            this.districtdepCurrdate = subdiv.data;
            console.log("Downloaded subdivdepCurrdate---->", this.districtdepCurrdate);
            return of(this.districtdepCurrdate); // Return the fetched data
          })
        )
      );
      return subdivData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null; // Handle error and return null in case of failure
    }
  }


  async updateAndShowFromDataEntry(weeks:any) {

    this.allData = []; // Reset data array
  
    // Use Promise.all to ensure all data is fetched before processing
    const results = await Promise.all(
      weeks.map(async (week:any) => {
        const data = {
          startDate: week.startDate,
          endDate: week.endDate,
        };
        const districtData = await this.updateCurrDateDataFromDataEntry(data);
        return { week, districtData }; 
      })
    );
  
    // Sort results to ensure correct order by the week (if necessary)
    results.sort((a, b) => new Date(a.week.startDate).getTime() - new Date(b.week.startDate).getTime());
  
    // Extract the data in the correct order
    this.allData = results.map((result) => result.districtData);
  
    console.log("All data from FTP:", this.allData);
    this.loadtheRows(); // Process the rows after all data is loaded
    return this.rows;
  }

  async updateCurrDateDataFromDataEntry(data: any) {
    try {
      const subdivData = await lastValueFrom(
        this.districtservice.fetchData(data).pipe(
          concatMap((subdiv) => {
            this.districtdepCurrdate = subdiv.data;
            console.log("Downloaded subdivdepCurrdate---->", this.districtdepCurrdate);
            return of(this.districtdepCurrdate); // Return the fetched data
          })
        )
      );
      return subdivData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null; // Handle error and return null in case of failure
    }
  }

  async downloadPdfAndExcel() {}

  loadtheRows() {
    this.rows = [];

    let districtColorCode = [72, 209, 204];
    let stateColorCode = [255, 255, 255];

    let index = 1;
    console.log('load rows , this.allData', this.allData)
    for (const district of this.allData[0]) {
      console.log("printing districts", district.district_name);

      const firstTwoColumns = [
        { content: index++ , styles:{fillColor : '#FFFFFF'}},
        {
          content: `${district.district_name}`,  styles:{fillColor : '#FFFFFF'}
        },
      ]
      this.rows.push(firstTwoColumns)
    }



    for (const listofdistrict of this.allData) {
        console.log(listofdistrict)

        let i = 0
        listofdistrict.forEach((district:any) => {
          const content = {
            content:
                    district.departure != null ? Math.round(district.departure) : " ",
            styles: 
                    { fillColor: this.getColorForRainfall1(district.departure)},    
            }
            this.rows[i++].push(content)

        });

      }
      console.log(this.rows)
  }

  convertToIndianDateFormat = (dateString: string) =>
    dateString.split("-").reverse().join("-");

  exportAsExcelFile(
    json: any[],
    excelFileName: string,
    columns: any,
    columns1: any
  ): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

    const startCell = "C1";
    const endCell = "F1";
    const startCell1 = "G1";
    const endCell1 = "J1";

    // Merge the cells
    worksheet["!merges"] = [
      {
        s: XLSX.utils.decode_cell(startCell),
        e: XLSX.utils.decode_cell(endCell),
      },
      {
        s: XLSX.utils.decode_cell(startCell1),
        e: XLSX.utils.decode_cell(endCell1),
      },
    ];

    XLSX.utils.sheet_add_aoa(worksheet, [columns1], { origin: "A1" });

    XLSX.utils.sheet_add_aoa(worksheet, [columns], { origin: "A2" });

    XLSX.utils.sheet_add_json(worksheet, json, {
      origin: "A3",
      skipHeader: true,
    });

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero for single-digit days

    return `${year}-${month}-${day}`;
  }

  //   getColorAndCat(departure: any) {
  //     let color = "";
  //     let Cat = "";
  //     if (departure == null) {
  //       return {
  //         color: "#c0c0c0",
  //         Cat: "ND",
  //       };
  //     }
  //     if (departure >= 60) {
  //       Cat = "LE";
  //       color = "#0096ff";
  //     } else if (departure >= 20 && departure <= 59) {
  //       Cat = "E";
  //       color = "#32c0f8";
  //     } else if (departure >= -19 && departure <= +19) {
  //       Cat = "N";
  //       color = "#00cd5b";
  //     } else if (departure >= -59 && departure <= -20) {
  //       Cat = "D";
  //       color = "#ff2700";
  //     } else if (departure >= -99 && departure <= -60) {
  //       Cat = "LD";
  //       color = "#ffff20";
  //     } else if ((departure = -100)) {
  //       Cat = "NR";
  //       color = "#ffffff";
  //     }

  //     return {
  //       color: color,
  //       Cat: Cat,
  //     };
  //   }

  getColorForRainfall1(rainfall: any): string {
    const numericId = rainfall;
    let cat = "";
    let count = 0;

    if (numericId == null || numericId === " ") {
      return "#c0c0c0";
    }
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
