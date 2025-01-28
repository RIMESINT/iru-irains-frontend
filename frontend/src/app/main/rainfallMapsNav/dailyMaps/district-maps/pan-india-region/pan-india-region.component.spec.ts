import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanIndiaRegionComponent } from './pan-india-region.component';

describe('PanIndiaRegionComponent', () => {
  let component: PanIndiaRegionComponent;
  let fixture: ComponentFixture<PanIndiaRegionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanIndiaRegionComponent]
    });
    fixture = TestBed.createComponent(PanIndiaRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
