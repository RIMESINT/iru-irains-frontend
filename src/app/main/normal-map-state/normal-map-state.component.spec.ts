import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalMapStateComponent } from './normal-map-state.component';

describe('NormalMapStateComponent', () => {
  let component: NormalMapStateComponent;
  let fixture: ComponentFixture<NormalMapStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalMapStateComponent]
    });
    fixture = TestBed.createComponent(NormalMapStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
