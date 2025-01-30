import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomogenousRainfallMapDailyActualComponent } from './homogenous-rainfall-map-daily-actual.component';

describe('HomogenousRainfallMapDailyActualComponent', () => {
  let component: HomogenousRainfallMapDailyActualComponent;
  let fixture: ComponentFixture<HomogenousRainfallMapDailyActualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomogenousRainfallMapDailyActualComponent]
    });
    fixture = TestBed.createComponent(HomogenousRainfallMapDailyActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
