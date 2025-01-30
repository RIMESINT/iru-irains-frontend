import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryRainfallMapDailyActualComponent } from './country-rainfall-map-daily-actual.component';

describe('CountryRainfallMapDailyActualComponent', () => {
  let component: CountryRainfallMapDailyActualComponent;
  let fixture: ComponentFixture<CountryRainfallMapDailyActualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryRainfallMapDailyActualComponent]
    });
    fixture = TestBed.createComponent(CountryRainfallMapDailyActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
