import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictActualMapDupComponent } from './district-actual-map-dup.component';

describe('DistrictActualMapDupComponent', () => {
  let component: DistrictActualMapDupComponent;
  let fixture: ComponentFixture<DistrictActualMapDupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistrictActualMapDupComponent]
    });
    fixture = TestBed.createComponent(DistrictActualMapDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
