import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryMapDupComponent } from './country-map-dup.component';

describe('CountryMapDupComponent', () => {
  let component: CountryMapDupComponent;
  let fixture: ComponentFixture<CountryMapDupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryMapDupComponent]
    });
    fixture = TestBed.createComponent(CountryMapDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
