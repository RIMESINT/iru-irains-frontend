import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMapsDupComponent } from './all-maps-dup.component';

describe('AllMapsDupComponent', () => {
  let component: AllMapsDupComponent;
  let fixture: ComponentFixture<AllMapsDupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllMapsDupComponent]
    });
    fixture = TestBed.createComponent(AllMapsDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
