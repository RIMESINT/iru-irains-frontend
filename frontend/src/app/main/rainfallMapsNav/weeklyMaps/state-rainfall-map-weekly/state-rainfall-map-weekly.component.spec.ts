import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateRainfallMapWeeklyComponent } from './state-rainfall-map-weekly.component';

describe('StateRainfallMapWeeklyComponent', () => {
  let component: StateRainfallMapWeeklyComponent;
  let fixture: ComponentFixture<StateRainfallMapWeeklyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StateRainfallMapWeeklyComponent]
    });
    fixture = TestBed.createComponent(StateRainfallMapWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
