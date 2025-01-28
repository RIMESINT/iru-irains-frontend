import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateActualMapDupComponent } from './state-actual-map-dup.component';

describe('StateActualMapDupComponent', () => {
  let component: StateActualMapDupComponent;
  let fixture: ComponentFixture<StateActualMapDupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StateActualMapDupComponent]
    });
    fixture = TestBed.createComponent(StateActualMapDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
