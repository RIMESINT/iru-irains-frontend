import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictNorthWestRainfallMapWeeklyComponent } from './district-north-west-rainfall-map-weekly.component';

describe('DistrictNorthWestRainfallMapWeeklyComponent', () => {
  let component: DistrictNorthWestRainfallMapWeeklyComponent;
  let fixture: ComponentFixture<DistrictNorthWestRainfallMapWeeklyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistrictNorthWestRainfallMapWeeklyComponent]
    });
    fixture = TestBed.createComponent(DistrictNorthWestRainfallMapWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
