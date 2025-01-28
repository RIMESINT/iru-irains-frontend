import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictCentralIndiaRainfallMapCummulativeComponent } from './district-central-india-rainfall-map-cummulative.component';

describe('DistrictCentralIndiaRainfallMapCummulativeComponent', () => {
  let component: DistrictCentralIndiaRainfallMapCummulativeComponent;
  let fixture: ComponentFixture<DistrictCentralIndiaRainfallMapCummulativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistrictCentralIndiaRainfallMapCummulativeComponent]
    });
    fixture = TestBed.createComponent(DistrictCentralIndiaRainfallMapCummulativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
