import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryRainfallMapCummulativeComponent } from './country-rainfall-map-cummulative.component';

describe('CountryRainfallMapCummulativeComponent', () => {
  let component: CountryRainfallMapCummulativeComponent;
  let fixture: ComponentFixture<CountryRainfallMapCummulativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryRainfallMapCummulativeComponent]
    });
    fixture = TestBed.createComponent(CountryRainfallMapCummulativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
