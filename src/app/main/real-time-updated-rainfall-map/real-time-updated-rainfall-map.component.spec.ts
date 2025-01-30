import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeUpdatedRainfallMapComponent } from './real-time-updated-rainfall-map.component';

describe('RealTimeUpdatedRainfallMapComponent', () => {
  let component: RealTimeUpdatedRainfallMapComponent;
  let fixture: ComponentFixture<RealTimeUpdatedRainfallMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RealTimeUpdatedRainfallMapComponent]
    });
    fixture = TestBed.createComponent(RealTimeUpdatedRainfallMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
