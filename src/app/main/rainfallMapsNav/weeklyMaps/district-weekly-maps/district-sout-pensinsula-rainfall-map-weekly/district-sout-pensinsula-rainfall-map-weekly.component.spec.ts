import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictSoutPensinsulaRainfallMapWeeklyComponent } from './district-sout-pensinsula-rainfall-map-weekly.component';

describe('DistrictSoutPensinsulaRainfallMapWeeklyComponent', () => {
  let component: DistrictSoutPensinsulaRainfallMapWeeklyComponent;
  let fixture: ComponentFixture<DistrictSoutPensinsulaRainfallMapWeeklyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistrictSoutPensinsulaRainfallMapWeeklyComponent]
    });
    fixture = TestBed.createComponent(DistrictSoutPensinsulaRainfallMapWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
