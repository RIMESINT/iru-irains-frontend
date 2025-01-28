import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateRainfallMapDailyActualComponent } from './state-rainfall-map-daily-actual.component';

describe('StateRainfallMapDailyActualComponent', () => {
  let component: StateRainfallMapDailyActualComponent;
  let fixture: ComponentFixture<StateRainfallMapDailyActualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StateRainfallMapDailyActualComponent]
    });
    fixture = TestBed.createComponent(StateRainfallMapDailyActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
