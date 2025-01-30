import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McRmcMapComponentForMcsActualComponent } from './mc-rmc-map-component-for-mcs-actual.component';

describe('McRmcMapComponentForMcsActualComponent', () => {
  let component: McRmcMapComponentForMcsActualComponent;
  let fixture: ComponentFixture<McRmcMapComponentForMcsActualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [McRmcMapComponentForMcsActualComponent]
    });
    fixture = TestBed.createComponent(McRmcMapComponentForMcsActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
