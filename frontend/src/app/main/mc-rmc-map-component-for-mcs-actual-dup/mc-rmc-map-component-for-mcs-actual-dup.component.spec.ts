import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McRmcMapComponentForMcsActualDupComponent } from './mc-rmc-map-component-for-mcs-actual-dup.component';

describe('McRmcMapComponentForMcsActualDupComponent', () => {
  let component: McRmcMapComponentForMcsActualDupComponent;
  let fixture: ComponentFixture<McRmcMapComponentForMcsActualDupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [McRmcMapComponentForMcsActualDupComponent]
    });
    fixture = TestBed.createComponent(McRmcMapComponentForMcsActualDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
