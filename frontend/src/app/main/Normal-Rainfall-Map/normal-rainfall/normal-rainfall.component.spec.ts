import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalRainfallComponent } from './normal-rainfall.component';

describe('NormalRainfallComponent', () => {
  let component: NormalRainfallComponent;
  let fixture: ComponentFixture<NormalRainfallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalRainfallComponent]
    });
    fixture = TestBed.createComponent(NormalRainfallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
