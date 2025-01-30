import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdivisionRainfallMapCummulativeComponent } from './subdivision-rainfall-map-cummulative.component';

describe('SubdivisionRainfallMapCummulativeComponent', () => {
  let component: SubdivisionRainfallMapCummulativeComponent;
  let fixture: ComponentFixture<SubdivisionRainfallMapCummulativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubdivisionRainfallMapCummulativeComponent]
    });
    fixture = TestBed.createComponent(SubdivisionRainfallMapCummulativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
