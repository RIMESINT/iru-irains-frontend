import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallmapRegionMcRmcComponent } from './rainfallmap-region-mc-rmc.component';

describe('RainfallmapRegionMcRmcComponent', () => {
  let component: RainfallmapRegionMcRmcComponent;
  let fixture: ComponentFixture<RainfallmapRegionMcRmcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallmapRegionMcRmcComponent]
    });
    fixture = TestBed.createComponent(RainfallmapRegionMcRmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
