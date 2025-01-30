import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomogenousRainfallMapDailyComponent } from './homogenous-rainfall-map-daily.component';

describe('HomogenousRainfallMapDailyComponent', () => {
  let component: HomogenousRainfallMapDailyComponent;
  let fixture: ComponentFixture<HomogenousRainfallMapDailyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomogenousRainfallMapDailyComponent]
    });
    fixture = TestBed.createComponent(HomogenousRainfallMapDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
