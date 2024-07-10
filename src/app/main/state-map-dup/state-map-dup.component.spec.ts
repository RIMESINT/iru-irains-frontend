import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateMapDupComponent } from './state-map-dup.component';

describe('StateMapDupComponent', () => {
  let component: StateMapDupComponent;
  let fixture: ComponentFixture<StateMapDupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StateMapDupComponent]
    });
    fixture = TestBed.createComponent(StateMapDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
