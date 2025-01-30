import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictSouthPeninsularRainfallMapCummulativeComponent } from './district-south-peninsular-rainfall-map-cummulative.component';

describe('DistrictSouthPeninsularRainfallMapCummulativeComponent', () => {
  let component: DistrictSouthPeninsularRainfallMapCummulativeComponent;
  let fixture: ComponentFixture<DistrictSouthPeninsularRainfallMapCummulativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistrictSouthPeninsularRainfallMapCummulativeComponent]
    });
    fixture = TestBed.createComponent(DistrictSouthPeninsularRainfallMapCummulativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
