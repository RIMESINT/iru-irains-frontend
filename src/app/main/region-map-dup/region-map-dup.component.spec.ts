import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionMapDupComponent } from './region-map-dup.component';

describe('RegionMapDupComponent', () => {
  let component: RegionMapDupComponent;
  let fixture: ComponentFixture<RegionMapDupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionMapDupComponent]
    });
    fixture = TestBed.createComponent(RegionMapDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
