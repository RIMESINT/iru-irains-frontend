import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdivisionMapDupComponent } from './subdivision-map-dup.component';

describe('SubdivisionMapDupComponent', () => {
  let component: SubdivisionMapDupComponent;
  let fixture: ComponentFixture<SubdivisionMapDupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubdivisionMapDupComponent]
    });
    fixture = TestBed.createComponent(SubdivisionMapDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
