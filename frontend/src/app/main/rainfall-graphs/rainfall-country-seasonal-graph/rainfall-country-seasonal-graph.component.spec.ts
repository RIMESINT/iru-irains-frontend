import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallCountrySeasonalGraphComponent } from './rainfall-country-seasonal-graph.component';

describe('RainfallCountrySeasonalGraphComponent', () => {
  let component: RainfallCountrySeasonalGraphComponent;
  let fixture: ComponentFixture<RainfallCountrySeasonalGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallCountrySeasonalGraphComponent]
    });
    fixture = TestBed.createComponent(RainfallCountrySeasonalGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
