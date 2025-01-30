import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSectionHelpIndexComponent } from './about-section-help-index.component';

describe('AboutSectionHelpIndexComponent', () => {
  let component: AboutSectionHelpIndexComponent;
  let fixture: ComponentFixture<AboutSectionHelpIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutSectionHelpIndexComponent]
    });
    fixture = TestBed.createComponent(AboutSectionHelpIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
