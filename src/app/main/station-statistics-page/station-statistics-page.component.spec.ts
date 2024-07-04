import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationStatisticsPageComponent } from './station-statistics-page.component';

describe('StationStatisticsPageComponent', () => {
  let component: StationStatisticsPageComponent;
  let fixture: ComponentFixture<StationStatisticsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StationStatisticsPageComponent]
    });
    fixture = TestBed.createComponent(StationStatisticsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
