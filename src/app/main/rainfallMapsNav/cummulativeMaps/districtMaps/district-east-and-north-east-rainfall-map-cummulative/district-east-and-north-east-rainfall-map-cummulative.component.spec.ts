import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictEastAndNorthEastRainfallMapCummulativeComponent } from './district-east-and-north-east-rainfall-map-cummulative.component';

describe('DistrictEastAndNorthEastRainfallMapCummulativeComponent', () => {
  let component: DistrictEastAndNorthEastRainfallMapCummulativeComponent;
  let fixture: ComponentFixture<DistrictEastAndNorthEastRainfallMapCummulativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistrictEastAndNorthEastRainfallMapCummulativeComponent]
    });
    fixture = TestBed.createComponent(DistrictEastAndNorthEastRainfallMapCummulativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
