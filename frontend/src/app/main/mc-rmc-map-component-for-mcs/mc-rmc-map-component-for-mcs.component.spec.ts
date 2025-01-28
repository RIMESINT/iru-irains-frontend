import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McRmcMapComponentForMCsComponent } from './mc-rmc-map-component-for-mcs.component';

describe('McRmcMapComponentForMCsComponent', () => {
  let component: McRmcMapComponentForMCsComponent;
  let fixture: ComponentFixture<McRmcMapComponentForMCsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [McRmcMapComponentForMCsComponent]
    });
    fixture = TestBed.createComponent(McRmcMapComponentForMCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
