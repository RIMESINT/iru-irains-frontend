import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictNorthWestRainfallMapCummulativeComponent } from './district-north-west-rainfall-map-cummulative.component';

describe('DistrictNorthWestRainfallMapCummulativeComponent', () => {
  let component: DistrictNorthWestRainfallMapCummulativeComponent;
  let fixture: ComponentFixture<DistrictNorthWestRainfallMapCummulativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistrictNorthWestRainfallMapCummulativeComponent]
    });
    fixture = TestBed.createComponent(DistrictNorthWestRainfallMapCummulativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
