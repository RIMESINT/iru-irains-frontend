import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouthPeninsularaRegionActualComponent } from './south-peninsulara-region-actual.component';

describe('SouthPeninsularaRegionActualComponent', () => {
  let component: SouthPeninsularaRegionActualComponent;
  let fixture: ComponentFixture<SouthPeninsularaRegionActualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SouthPeninsularaRegionActualComponent]
    });
    fixture = TestBed.createComponent(SouthPeninsularaRegionActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
