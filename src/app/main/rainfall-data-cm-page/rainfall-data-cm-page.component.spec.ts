import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallDataCmPageComponent } from './rainfall-data-cm-page.component';

describe('RainfallDataCmPageComponent', () => {
  let component: RainfallDataCmPageComponent;
  let fixture: ComponentFixture<RainfallDataCmPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallDataCmPageComponent]
    });
    fixture = TestBed.createComponent(RainfallDataCmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
