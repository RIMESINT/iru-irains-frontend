import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionActualMapDupComponent } from './region-actual-map-dup.component';

describe('RegionActualMapDupComponent', () => {
  let component: RegionActualMapDupComponent;
  let fixture: ComponentFixture<RegionActualMapDupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionActualMapDupComponent]
    });
    fixture = TestBed.createComponent(RegionActualMapDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
