import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NorthWestRegionActualComponent } from './north-west-region-actual.component';

describe('NorthWestRegionActualComponent', () => {
  let component: NorthWestRegionActualComponent;
  let fixture: ComponentFixture<NorthWestRegionActualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NorthWestRegionActualComponent]
    });
    fixture = TestBed.createComponent(NorthWestRegionActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
