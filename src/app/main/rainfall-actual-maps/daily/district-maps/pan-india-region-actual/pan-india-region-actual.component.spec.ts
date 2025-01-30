import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanIndiaRegionActualComponent } from './pan-india-region-actual.component';

describe('PanIndiaRegionActualComponent', () => {
  let component: PanIndiaRegionActualComponent;
  let fixture: ComponentFixture<PanIndiaRegionActualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanIndiaRegionActualComponent]
    });
    fixture = TestBed.createComponent(PanIndiaRegionActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
