import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root'
})
export class PdfUploadService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  uploadPdf(userId: number, pdfName: string, pdfType: string, pdfFile: File): Observable<any> {
    const formData: FormData = new FormData();

    // Append form fields
    formData.append('userId', userId.toString());
    formData.append('document_name', pdfName);
    formData.append('document_type', pdfType);
    formData.append('pdfFile', pdfFile, pdfFile.name);

    // Send the request to the backend
    return this.http.post(`${this.baseUrl}/api/v1/uploadPdf`, formData).pipe(
        catchError((error) => {
            console.error('Upload failed', error);
            return throwError(error);
        })
    );
  }

    // fetchPdf(documentId: number): void {
    //   const pdfUrl = `${this.baseUrl}/api/v1/getPdf/${documentId}`;
    //   console.log(pdfUrl);
    //   // window.open(pdfUrl, '_blank'); // Open the PDF in a new tab
    // }

    fetchPdf(documentId: number): void {
      const pdfUrl = `${this.baseUrl}/api/v1/getPdf/${documentId}`;
      
      this.http.get(pdfUrl, { responseType: 'blob' }).subscribe(
        (response) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url); // Open the PDF in a new tab
        },
        (error) => {
          console.error('Error fetching PDF:', error);
        }
      );
    }

  
}