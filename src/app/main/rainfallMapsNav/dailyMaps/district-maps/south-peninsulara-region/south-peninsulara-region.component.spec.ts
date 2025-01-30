import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouthPeninsularaRegionComponent } from './south-peninsulara-region.component';

describe('SouthPeninsularaRegionComponent', () => {
  let component: SouthPeninsularaRegionComponent;
  let fixture: ComponentFixture<SouthPeninsularaRegionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SouthPeninsularaRegionComponent]
    });
    fixture = TestBed.createComponent(SouthPeninsularaRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
