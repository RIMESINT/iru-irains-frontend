import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryRainfallMapDailyComponent } from './country-rainfall-map-daily.component';

describe('CountryRainfallMapDailyComponent', () => {
  let component: CountryRainfallMapDailyComponent;
  let fixture: ComponentFixture<CountryRainfallMapDailyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryRainfallMapDailyComponent]
    });
    fixture = TestBed.createComponent(CountryRainfallMapDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
