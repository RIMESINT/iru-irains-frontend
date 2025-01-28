import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralIndiaRegionActualComponent } from './central-india-region-actual.component';

describe('CentralIndiaRegionActualComponent', () => {
  let component: CentralIndiaRegionActualComponent;
  let fixture: ComponentFixture<CentralIndiaRegionActualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CentralIndiaRegionActualComponent]
    });
    fixture = TestBed.createComponent(CentralIndiaRegionActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
