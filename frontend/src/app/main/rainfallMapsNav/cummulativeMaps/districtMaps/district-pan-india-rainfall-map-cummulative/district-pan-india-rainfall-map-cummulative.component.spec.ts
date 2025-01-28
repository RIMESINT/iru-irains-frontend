import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictPanIndiaRainfallMapCummulativeComponent } from './district-pan-india-rainfall-map-cummulative.component';

describe('DistrictPanIndiaRainfallMapCummulativeComponent', () => {
  let component: DistrictPanIndiaRainfallMapCummulativeComponent;
  let fixture: ComponentFixture<DistrictPanIndiaRainfallMapCummulativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistrictPanIndiaRainfallMapCummulativeComponent]
    });
    fixture = TestBed.createComponent(DistrictPanIndiaRainfallMapCummulativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
