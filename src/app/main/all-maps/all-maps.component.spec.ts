import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMapsComponent } from './all-maps.component';

describe('AllMapsComponent', () => {
  let component: AllMapsComponent;
  let fixture: ComponentFixture<AllMapsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllMapsComponent]
    });
    fixture = TestBed.createComponent(AllMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
