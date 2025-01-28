import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdivisionRainfallMapWeeklyComponent } from './subdivision-rainfall-map-weekly.component';

describe('SubdivisionRainfallMapWeeklyComponent', () => {
  let component: SubdivisionRainfallMapWeeklyComponent;
  let fixture: ComponentFixture<SubdivisionRainfallMapWeeklyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubdivisionRainfallMapWeeklyComponent]
    });
    fixture = TestBed.createComponent(SubdivisionRainfallMapWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
