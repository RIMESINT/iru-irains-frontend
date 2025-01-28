import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { StateService } from 'src/app/services/state/state.service';
import { DistrictService } from 'src/app/services/district/district.service';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface DepartureCounts {
    state: string;
    counts: {
        LE: number;
        E: number;
        N: number;
        D: number;
        LD: number;
        NR: number;
        ND: number;
        Total: number;
    };

}

@Component({
    selector: 'app-distribution-district-states-daily',
    templateUrl: './distribution-district-states-daily.component.html',
    styleUrls: ['./distribution-district-states-daily.component.css']
})
export class DistributionDistrictStatesDailyComponent implements OnInit {
    stateData: any[] = [];
    districtData: any[] = [];
    mappedData: any[] = [];
    departureCounts: DepartureCounts[] = [];
    selectedSeason: string = 'Winter';
    isLoading: boolean = true;

    displayedColumns: string[] = [ 'S.no', 'state', 'LE', 'E', 'N', 'D', 'LD', 'NR', 'ND', 'Total'];

    startDate: string = ''; 
    endDate: string = '';   

    totalDistricts: number = 0; // To store the total number of districts
    percentages: any = {}; // To store the percentages for each category

    constructor(
        private stateService: StateService,
        private districtService: DistrictService,
        private http: HttpClient // Add HttpClient for API calls
    ) {}

    ngOnInit(): void {
        this.fetchData();
    }

    
    getSeasonAndDateRange(): { startDate: string; endDate: string } {
        const today = new Date();
        const year = today.getFullYear();

        let startDate: string = this.formatDate(today); 
        let endDate: string = this.formatDate(today); 

        // Define season ranges
        const winterStart = new Date(year, 0, 1); // Jan 1
        const winterEnd = new Date(year, 1, 29); // Feb 28/29 (will be handled dynamically)

        const preMonsoonStart = new Date(year, 2, 1); // Mar 1
        const preMonsoonEnd = new Date(year, 4, 31); // May 31

        const monsoonStart = new Date(year, 5, 1); // Jun 1
        const monsoonEnd = new Date(year, 8, 30); // Sep 30

        const postMonsoonStart = new Date(year, 9, 1); // Oct 1
        const postMonsoonEnd = new Date(year, 11, 31); // Dec 31

        // Check which season the current date falls into
        if (today >= winterStart && today <= winterEnd) {
            // Handle leap year for February end date
            const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            winterEnd.setDate(isLeapYear ? 29 : 28);

            startDate = this.formatDate(winterStart);
            endDate = today <= winterEnd ? this.formatDate(today) : this.formatDate(winterEnd);

        } else if (today >= preMonsoonStart && today <= preMonsoonEnd) {
            startDate = this.formatDate(preMonsoonStart);
            endDate = today <= preMonsoonEnd ? this.formatDate(today) : this.formatDate(preMonsoonEnd);

        } else if (today >= monsoonStart && today <= monsoonEnd) {
            startDate = this.formatDate(monsoonStart);
            endDate = today <= monsoonEnd ? this.formatDate(today) : this.formatDate(monsoonEnd);

        } else if (today >= postMonsoonStart && today <= postMonsoonEnd) {
            startDate = this.formatDate(postMonsoonStart);
            endDate = today <= postMonsoonEnd ? this.formatDate(today) : this.formatDate(postMonsoonEnd);
        }

        return { startDate, endDate };
    }

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); 
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    // Fetch data function with dynamic dates based on the current season
    fetchData() {
        this.isLoading = true; 
        const { startDate, endDate } = this.getSeasonAndDateRange();
  
        // Set the startDate and endDate for display
        this.startDate = startDate;
        this.endDate = endDate;

        const stateRequestBody = {}; // Replace with actual state API payload if needed

        const districtRequestBody = {
            startDate: startDate,
            endDate: endDate
        };

        // Fetch state data and district data with dynamic date ranges
        forkJoin([
            this.stateService.fetchData(stateRequestBody),
            this.districtService.fetchDataFtp(districtRequestBody)
        ]).subscribe(([stateResponse, districtResponse]) => {
            if (stateResponse.success && districtResponse.success) {
                this.stateData = stateResponse.data;
                this.districtData = districtResponse.data;

                // Map the data based on state_code
                this.mappedData = this.stateData.map(state => {
                    const districts = this.districtData.filter(district => district.state_code === state.state_code);
                    return {
                        state_name: state.state_name,
                        state_code: state.state_code,
                        rainfall_normal_value: state.rainfall_normal_value,
                        actual_state_rainfall: state.actual_state_rainfall,
                        departure: districts.map(district => district.departure)
                    };
                });

                // Calculate departure counts
                this.departureCounts = this.countDepartureValues(this.mappedData);

                // Calculate sum totals and add sum row
                this.calculateSumTotals(); // Call to calculate sums

                console.log(this.mappedData);
            }
            this.isLoading = false; 
        });
    }

    
    calculateSumTotals() {
        const sumCounts = {
            LE: 0,
            E: 0,
            N: 0,
            D: 0,
            LD: 0,
            NR: 0,
            ND: 0,
            Total: 0
        };
    
        // Sum up the counts
        this.departureCounts.forEach(item => {
            sumCounts.LE += item.counts.LE;
            sumCounts.E += item.counts.E;
            sumCounts.N += item.counts.N;
            sumCounts.D += item.counts.D;
            sumCounts.LD += item.counts.LD;
            sumCounts.NR += item.counts.NR;
            sumCounts.ND += item.counts.ND;
            sumCounts.Total += item.counts.Total;
        });
    
        // Calculate total districts
        this.totalDistricts = sumCounts.Total;
    
        // Add a sum row
        const sumRow: DepartureCounts = { state: 'TOTAL', counts: sumCounts };
        this.departureCounts.push(sumRow);
    
        // Calculate percentages
        this.calculatePercentages(sumCounts);
    
        const percentageRow: DepartureCounts = {
            state: `${this.totalDistricts} Total Districts`, 
            counts: {
                LE: this.percentages.LE,
                E: this.percentages.E,
                N: this.percentages.N,
                D: this.percentages.D,
                LD: this.percentages.LD,
                NR: this.percentages.NR_ND, // Combining NR and ND
                ND: 0, // Hide ND percentage if not needed separately
                Total: 100 // The total should always sum to 100%
            }
        };
    
        // Push these new rows into the table
        // this.departureCounts.push(totalRow);
        this.departureCounts.push(percentageRow);
    }

    calculatePercentages(sumCounts: any) {
        const total = sumCounts.LE + sumCounts.E + sumCounts.N + sumCounts.D + sumCounts.LD + (sumCounts.NR + sumCounts.ND);
        
        this.percentages = {
            LE: Math.trunc((sumCounts.LE / total) * 100) || 0,  // Remove decimal part
            E: Math.trunc((sumCounts.E / total) * 100) || 0,    // Remove decimal part
            N: Math.trunc((sumCounts.N / total) * 100) || 0,    // Remove decimal part
            D: Math.trunc((sumCounts.D / total) * 100) || 0,    // Remove decimal part
            LD: Math.trunc((sumCounts.LD / total) * 100) || 0,  // Remove decimal part
            NR_ND: Math.trunc(((sumCounts.NR + sumCounts.ND) / total) * 100) || 0  // Remove decimal part
        };
    }
    

    
    countDepartureValues(statesData: { state_name: string; departure: number[] }[]): DepartureCounts[] {
        return statesData.map(({ state_name, departure }) => {
            const counts = {
                LE: 0,
                E: 0,
                N: 0,
                D: 0,
                LD: 0,
                NR: 0,
                ND: 0,
                Total: 0 // Initialize total
            };

            departure.forEach(dep => {
                if (dep >= 60) {
                    counts.LE++;
                } else if (dep >= 20 && dep <= 59) {
                    counts.E++;
                } else if (dep >= -19 && dep <= 19) {
                    counts.N++;
                } else if (dep >= -59 && dep <= -20) {
                    counts.D++;
                } else if (dep >= -99 && dep <= -60) {
                    counts.LD++;
                } else if (dep === -100) {
                    counts.NR++;
                } else {
                    counts.ND++;
                }
            });

              // Calculate total
        counts.Total = counts.LE + counts.E + counts.N + counts.D + counts.LD + counts.NR + counts.ND;

        return { state: state_name, counts };
        });
    }

  
    //  exportToExcel() {
    //     const dataToExport = this.departureCounts.map(row => ({
    //         Period: this.startDate + ' to ' + this.endDate,
    //         State: row.state,
    //         LE: row.counts.LE,
    //         E: row.counts.E,
    //         N: row.counts.N,
    //         D: row.counts.D,
    //         LD: row.counts.LD,
    //         NR: row.counts.NR,
    //         ND: row.counts.ND,
    //         Total: row.counts.Total
    //     }));

    //     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    //     const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Statewise Distribution');

    //     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //     this.saveAsExcelFile(excelBuffer, 'statewise_distribution');
    // }
    exportToExcel() {
        // Function to format the date to DD-MM-YYYY
        const formatDate = (date: string) => {
            const [year, month, day] = date.split('-');
            return `${day}-${month}-${year}`; // Reorder to DD-MM-YYYY
        };
    
        // Create the period row with formatted dates
        const periodRow = [{
            Period: `                                          PERIOD: ${formatDate(this.startDate)} to ${formatDate(this.endDate)}`
        }];
    
        // Prepare the header row
        const headers = [{
            'S.No': 'S.No.',
            'State': 'State',
            'LE': 'LE',
            'E': 'E',
            'N': 'N',
            'D': 'D',
            'LD': 'LD',
            'NR': 'NR',
            'ND': 'ND',
            'Total': 'Total'
        }];
    
        // Prepare the data to export including serial numbers
        const dataToExport = this.departureCounts.map((row, index) => ({
            'S.No': index + 1, // Add serial number here
            'State': row.state,
            'LE': row.counts.LE,
            'E': row.counts.E,
            'N': row.counts.N,
            'D': row.counts.D,
            'LD': row.counts.LD,
            'NR': row.counts.NR,
            'ND': row.counts.ND,
            'Total': row.counts.Total
        }));
    
        // Create a new worksheet
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(periodRow, { skipHeader: true });
    
        // Add the header row to the worksheet
        XLSX.utils.sheet_add_json(worksheet, headers, { skipHeader: true, origin: -1 });
    
        // Add the rest of the data to the worksheet
        XLSX.utils.sheet_add_json(worksheet, dataToExport, { skipHeader: true, origin: -1 });
    
        // Merge cells for the period row (assuming your table has 10 columns now)
        worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }]; // Merging cells A1 to J1
    
        // Center the merged cell (period cell)
        const mergedCellAddress = 'A1'; // The address of the merged cell
        if (!worksheet[mergedCellAddress]) {
            worksheet[mergedCellAddress] = { v: `PERIOD ${formatDate(this.startDate)} to ${formatDate(this.endDate)}`, t: 's' };
        }
    
        // Set the style for the merged cell
        worksheet[mergedCellAddress].s = {
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            }
        };
    
        // Create a new workbook and append the worksheet
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Statewise Distribution');
    
        // Write the workbook to a buffer and save it as an Excel file
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'statewise_distribution');
    }
    
    
    saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(data, `${fileName}.xlsx`);
    }    
}
