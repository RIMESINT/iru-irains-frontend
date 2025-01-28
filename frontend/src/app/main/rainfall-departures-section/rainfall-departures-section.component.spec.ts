import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallDeparturesSectionComponent } from './rainfall-departures-section.component';

describe('RainfallDeparturesSectionComponent', () => {
  let component: RainfallDeparturesSectionComponent;
  let fixture: ComponentFixture<RainfallDeparturesSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallDeparturesSectionComponent]
    });
    fixture = TestBed.createComponent(RainfallDeparturesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
