import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McRmcMapComponentForMCsDupComponent } from './mc-rmc-map-component-for-mcs-dup.component';

describe('McRmcMapComponentForMCsDupComponent', () => {
  let component: McRmcMapComponentForMCsDupComponent;
  let fixture: ComponentFixture<McRmcMapComponentForMCsDupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [McRmcMapComponentForMCsDupComponent]
    });
    fixture = TestBed.createComponent(McRmcMapComponentForMCsDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
