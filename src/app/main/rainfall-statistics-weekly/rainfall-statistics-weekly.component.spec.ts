import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallStatisticsWeeklyComponent } from './rainfall-statistics-weekly.component';

describe('RainfallStatisticsWeeklyComponent', () => {
  let component: RainfallStatisticsWeeklyComponent;
  let fixture: ComponentFixture<RainfallStatisticsWeeklyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallStatisticsWeeklyComponent]
    });
    fixture = TestBed.createComponent(RainfallStatisticsWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
