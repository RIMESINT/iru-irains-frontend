import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EastNorthEastRegionActualComponent } from './east-north-east-region-actual.component';

describe('EastNorthEastRegionActualComponent', () => {
  let component: EastNorthEastRegionActualComponent;
  let fixture: ComponentFixture<EastNorthEastRegionActualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EastNorthEastRegionActualComponent]
    });
    fixture = TestBed.createComponent(EastNorthEastRegionActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
