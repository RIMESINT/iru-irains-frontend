import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeUpdatedRainfallActualMapsComponent } from './real-time-updated-rainfall-actual-maps.component';

describe('RealTimeUpdatedRainfallActualMapsComponent', () => {
  let component: RealTimeUpdatedRainfallActualMapsComponent;
  let fixture: ComponentFixture<RealTimeUpdatedRainfallActualMapsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RealTimeUpdatedRainfallActualMapsComponent]
    });
    fixture = TestBed.createComponent(RealTimeUpdatedRainfallActualMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
