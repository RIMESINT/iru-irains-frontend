import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NorthWestRegionComponent } from './north-west-region.component';

describe('NorthWestRegionComponent', () => {
  let component: NorthWestRegionComponent;
  let fixture: ComponentFixture<NorthWestRegionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NorthWestRegionComponent]
    });
    fixture = TestBed.createComponent(NorthWestRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
