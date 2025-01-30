import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallmapSubdivMcRmcComponent } from './rainfallmap-subdiv-mc-rmc.component';

describe('RainfallmapSubdivMcRmcComponent', () => {
  let component: RainfallmapSubdivMcRmcComponent;
  let fixture: ComponentFixture<RainfallmapSubdivMcRmcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallmapSubdivMcRmcComponent]
    });
    fixture = TestBed.createComponent(RainfallmapSubdivMcRmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
