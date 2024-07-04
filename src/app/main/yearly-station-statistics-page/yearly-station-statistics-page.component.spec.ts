import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyStationStatisticsPageComponent } from './yearly-station-statistics-page.component';

describe('YearlyStationStatisticsPageComponent', () => {
  let component: YearlyStationStatisticsPageComponent;
  let fixture: ComponentFixture<YearlyStationStatisticsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YearlyStationStatisticsPageComponent]
    });
    fixture = TestBed.createComponent(YearlyStationStatisticsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
