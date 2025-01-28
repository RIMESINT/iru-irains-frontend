import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStatesActualMapsComponent } from './all-states-actual-maps.component';

describe('AllStatesActualMapsComponent', () => {
  let component: AllStatesActualMapsComponent;
  let fixture: ComponentFixture<AllStatesActualMapsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllStatesActualMapsComponent]
    });
    fixture = TestBed.createComponent(AllStatesActualMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
