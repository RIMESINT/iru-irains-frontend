import { Component } from '@angular/core';
// import { PdfUploadService } from 'src/app/services/pdfUploadService/pdf-upload.service';
import { PdfUploadService } from 'src/app/services/pdfUploadService.ts/pdf-upload.service';
@Component({
  selector: 'app-upload-file-pdf',
  templateUrl: './upload-file-pdf.component.html',
  styleUrls: ['./upload-file-pdf.component.css']
})
export class UploadFilePdfComponent {

    selectedFile: File | null = null;
    selectedSection: string = '';
    selectedFileName: string = '';
    uploadSuccess: boolean = false;
    uploadError: string | null = null;
    loading: boolean = false;
    formSubmitted: boolean = false;
  
    constructor(private pdfUploadService: PdfUploadService) {}
  
    // Handle file selection from input
    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.selectedFileName = file.name;
      }
    }
  
    onSectionSelected(event: any): void {
      this.selectedSection = event.target.value;
    }
  
    // Handle the file upload
    uploadFile(): void {
      this.formSubmitted = true;
      this.uploadSuccess = false;
      this.uploadError = null;
  
      if (this.selectedFile && this.selectedSection) {
        const userId = 123; // Example userId, replace with actual userId logic
        const pdfName = this.selectedFileName;
        const pdfType = this.selectedSection;
  
        this.loading = true;  // Start loading spinner
  
        // Call the service to upload the PDF
        this.pdfUploadService.uploadPdf(userId, pdfName, pdfType, this.selectedFile)
          .subscribe({
            next: (response) => {
              this.loading = false;  // Stop loading spinner
              this.uploadSuccess = true;  // Show success message
            },
            error: (error) => {
              this.loading = false;  // Stop loading spinner
              this.uploadError = 'Upload failed. Please try again.';  // Show error message
              console.error('Upload failed', error);
            }
          });
      } else {
        console.error('File or section is missing!');
        this.uploadError = 'Please fill out all required fields.';
      }
    }
  }
