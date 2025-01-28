import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastYearsDistrictDataComponent } from './last-years-district-data.component';

describe('LastYearsDistrictDataComponent', () => {
  let component: LastYearsDistrictDataComponent;
  let fixture: ComponentFixture<LastYearsDistrictDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LastYearsDistrictDataComponent]
    });
    fixture = TestBed.createComponent(LastYearsDistrictDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
