import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStatesMapComponent } from './all-states-map.component';

describe('AllStatesMapComponent', () => {
  let component: AllStatesMapComponent;
  let fixture: ComponentFixture<AllStatesMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllStatesMapComponent]
    });
    fixture = TestBed.createComponent(AllStatesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
