import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionRainfallMapCummulativeComponent } from './region-rainfall-map-cummulative.component';

describe('RegionRainfallMapCummulativeComponent', () => {
  let component: RegionRainfallMapCummulativeComponent;
  let fixture: ComponentFixture<RegionRainfallMapCummulativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionRainfallMapCummulativeComponent]
    });
    fixture = TestBed.createComponent(RegionRainfallMapCummulativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
