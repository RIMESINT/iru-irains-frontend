import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EastNorthEastRegionComponent } from './east-north-east-region.component';

describe('EastNorthEastRegionComponent', () => {
  let component: EastNorthEastRegionComponent;
  let fixture: ComponentFixture<EastNorthEastRegionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EastNorthEastRegionComponent]
    });
    fixture = TestBed.createComponent(EastNorthEastRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
