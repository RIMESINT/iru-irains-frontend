import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateRainfallMapCummulativeComponent } from './state-rainfall-map-cummulative.component';

describe('StateRainfallMapCummulativeComponent', () => {
  let component: StateRainfallMapCummulativeComponent;
  let fixture: ComponentFixture<StateRainfallMapCummulativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StateRainfallMapCummulativeComponent]
    });
    fixture = TestBed.createComponent(StateRainfallMapCummulativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
