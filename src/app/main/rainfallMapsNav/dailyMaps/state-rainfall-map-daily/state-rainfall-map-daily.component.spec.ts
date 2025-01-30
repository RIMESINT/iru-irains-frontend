import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateRainfallMapDailyComponent } from './state-rainfall-map-daily.component';

describe('StateRainfallMapDailyComponent', () => {
  let component: StateRainfallMapDailyComponent;
  let fixture: ComponentFixture<StateRainfallMapDailyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StateRainfallMapDailyComponent]
    });
    fixture = TestBed.createComponent(StateRainfallMapDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
