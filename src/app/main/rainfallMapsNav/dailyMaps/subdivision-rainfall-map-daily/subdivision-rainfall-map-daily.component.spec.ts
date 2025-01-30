import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdivisionRainfallMapDailyComponent } from './subdivision-rainfall-map-daily.component';

describe('SubdivisionRainfallMapDailyComponent', () => {
  let component: SubdivisionRainfallMapDailyComponent;
  let fixture: ComponentFixture<SubdivisionRainfallMapDailyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubdivisionRainfallMapDailyComponent]
    });
    fixture = TestBed.createComponent(SubdivisionRainfallMapDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
