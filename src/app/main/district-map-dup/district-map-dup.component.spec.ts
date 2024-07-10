import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictMapDupComponent } from './district-map-dup.component';

describe('DistrictMapDupComponent', () => {
  let component: DistrictMapDupComponent;
  let fixture: ComponentFixture<DistrictMapDupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistrictMapDupComponent]
    });
    fixture = TestBed.createComponent(DistrictMapDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
