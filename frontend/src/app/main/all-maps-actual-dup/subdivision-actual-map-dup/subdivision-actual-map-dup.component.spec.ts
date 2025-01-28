import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdivisionActualMapDupComponent } from './subdivision-actual-map-dup.component';

describe('SubdivisionActualMapDupComponent', () => {
  let component: SubdivisionActualMapDupComponent;
  let fixture: ComponentFixture<SubdivisionActualMapDupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubdivisionActualMapDupComponent]
    });
    fixture = TestBed.createComponent(SubdivisionActualMapDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
