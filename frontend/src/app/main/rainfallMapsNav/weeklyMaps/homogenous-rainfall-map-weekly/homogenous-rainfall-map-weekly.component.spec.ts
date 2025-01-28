import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomogenousRainfallMapWeeklyComponent } from './homogenous-rainfall-map-weekly.component';

describe('HomogenousRainfallMapWeeklyComponent', () => {
  let component: HomogenousRainfallMapWeeklyComponent;
  let fixture: ComponentFixture<HomogenousRainfallMapWeeklyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomogenousRainfallMapWeeklyComponent]
    });
    fixture = TestBed.createComponent(HomogenousRainfallMapWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
