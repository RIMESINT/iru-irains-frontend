import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictEastAndNorthEastRainfallMapWeeklyComponent } from './district-east-and-north-east-rainfall-map-weekly.component';

describe('DistrictEastAndNorthEastRainfallMapWeeklyComponent', () => {
  let component: DistrictEastAndNorthEastRainfallMapWeeklyComponent;
  let fixture: ComponentFixture<DistrictEastAndNorthEastRainfallMapWeeklyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistrictEastAndNorthEastRainfallMapWeeklyComponent]
    });
    fixture = TestBed.createComponent(DistrictEastAndNorthEastRainfallMapWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
