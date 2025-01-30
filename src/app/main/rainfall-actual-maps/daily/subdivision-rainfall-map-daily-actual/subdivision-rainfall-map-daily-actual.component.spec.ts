import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdivisionRainfallMapDailyActualComponent } from './subdivision-rainfall-map-daily-actual.component';

describe('SubdivisionRainfallMapDailyActualComponent', () => {
  let component: SubdivisionRainfallMapDailyActualComponent;
  let fixture: ComponentFixture<SubdivisionRainfallMapDailyActualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubdivisionRainfallMapDailyActualComponent]
    });
    fixture = TestBed.createComponent(SubdivisionRainfallMapDailyActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
