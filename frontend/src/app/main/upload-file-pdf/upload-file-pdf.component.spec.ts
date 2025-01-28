import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFilePdfComponent } from './upload-file-pdf.component';

describe('UploadFilePdfComponent', () => {
  let component: UploadFilePdfComponent;
  let fixture: ComponentFixture<UploadFilePdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadFilePdfComponent]
    });
    fixture = TestBed.createComponent(UploadFilePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
