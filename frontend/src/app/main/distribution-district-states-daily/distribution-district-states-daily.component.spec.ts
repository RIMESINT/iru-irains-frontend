import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionDistrictStatesDailyComponent } from './distribution-district-states-daily.component';

describe('DistributionDistrictStatesDailyComponent', () => {
  let component: DistributionDistrictStatesDailyComponent;
  let fixture: ComponentFixture<DistributionDistrictStatesDailyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistributionDistrictStatesDailyComponent]
    });
    fixture = TestBed.createComponent(DistributionDistrictStatesDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
