import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictActualMapComponent } from './district-actual-map.component';

describe('DistrictActualMapComponent', () => {
  let component: DistrictActualMapComponent;
  let fixture: ComponentFixture<DistrictActualMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistrictActualMapComponent]
    });
    fixture = TestBed.createComponent(DistrictActualMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
