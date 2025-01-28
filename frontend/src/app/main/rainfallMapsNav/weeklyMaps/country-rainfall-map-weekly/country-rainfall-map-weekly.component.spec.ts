import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryRainfallMapWeeklyComponent } from './country-rainfall-map-weekly.component';

describe('CountryRainfallMapWeeklyComponent', () => {
  let component: CountryRainfallMapWeeklyComponent;
  let fixture: ComponentFixture<CountryRainfallMapWeeklyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryRainfallMapWeeklyComponent]
    });
    fixture = TestBed.createComponent(CountryRainfallMapWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
