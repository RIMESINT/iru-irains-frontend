import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictCentralIndiaRainfallMapWeeklyComponent } from './district-central-india-rainfall-map-weekly.component';

describe('DistrictCentralIndiaRainfallMapWeeklyComponent', () => {
  let component: DistrictCentralIndiaRainfallMapWeeklyComponent;
  let fixture: ComponentFixture<DistrictCentralIndiaRainfallMapWeeklyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistrictCentralIndiaRainfallMapWeeklyComponent]
    });
    fixture = TestBed.createComponent(DistrictCentralIndiaRainfallMapWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
