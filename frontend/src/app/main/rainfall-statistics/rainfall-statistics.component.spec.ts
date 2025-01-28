import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallStatisticsComponent } from './rainfall-statistics.component';

describe('RainfallStatisticsComponent', () => {
  let component: RainfallStatisticsComponent;
  let fixture: ComponentFixture<RainfallStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallStatisticsComponent]
    });
    fixture = TestBed.createComponent(RainfallStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
