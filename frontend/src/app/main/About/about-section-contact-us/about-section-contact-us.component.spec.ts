import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSectionContactUsComponent } from './about-section-contact-us.component';

describe('AboutSectionContactUsComponent', () => {
  let component: AboutSectionContactUsComponent;
  let fixture: ComponentFixture<AboutSectionContactUsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutSectionContactUsComponent]
    });
    fixture = TestBed.createComponent(AboutSectionContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
