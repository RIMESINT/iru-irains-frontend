import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictPanRainfallMapWeeklyComponent } from './district-pan-rainfall-map-weekly.component';

describe('DistrictPanRainfallMapWeeklyComponent', () => {
  let component: DistrictPanRainfallMapWeeklyComponent;
  let fixture: ComponentFixture<DistrictPanRainfallMapWeeklyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistrictPanRainfallMapWeeklyComponent]
    });
    fixture = TestBed.createComponent(DistrictPanRainfallMapWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
