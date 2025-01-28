import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateActualMapComponent } from './state-actual-map.component';

describe('StateActualMapComponent', () => {
  let component: StateActualMapComponent;
  let fixture: ComponentFixture<StateActualMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StateActualMapComponent]
    });
    fixture = TestBed.createComponent(StateActualMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
