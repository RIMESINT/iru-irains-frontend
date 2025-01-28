import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdivisionActualMapComponent } from './subdivision-actual-map.component';

describe('SubdivisionActualMapComponent', () => {
  let component: SubdivisionActualMapComponent;
  let fixture: ComponentFixture<SubdivisionActualMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubdivisionActualMapComponent]
    });
    fixture = TestBed.createComponent(SubdivisionActualMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
