import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralRegionComponent } from './central-region.component';

describe('CentralRegionComponent', () => {
  let component: CentralRegionComponent;
  let fixture: ComponentFixture<CentralRegionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CentralRegionComponent]
    });
    fixture = TestBed.createComponent(CentralRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
