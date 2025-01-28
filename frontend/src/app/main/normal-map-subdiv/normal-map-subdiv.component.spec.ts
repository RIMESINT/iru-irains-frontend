import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalMapSubdivComponent } from './normal-map-subdiv.component';

describe('NormalMapSubdivComponent', () => {
  let component: NormalMapSubdivComponent;
  let fixture: ComponentFixture<NormalMapSubdivComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalMapSubdivComponent]
    });
    fixture = TestBed.createComponent(NormalMapSubdivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
