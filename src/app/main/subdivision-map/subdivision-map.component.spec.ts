import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdivisionMapComponent } from './subdivision-map.component';

describe('SubdivisionMapComponent', () => {
  let component: SubdivisionMapComponent;
  let fixture: ComponentFixture<SubdivisionMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubdivisionMapComponent]
    });
    fixture = TestBed.createComponent(SubdivisionMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
