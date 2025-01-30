import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionActualMapComponent } from './region-actual-map.component';

describe('RegionActualMapComponent', () => {
  let component: RegionActualMapComponent;
  let fixture: ComponentFixture<RegionActualMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionActualMapComponent]
    });
    fixture = TestBed.createComponent(RegionActualMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
