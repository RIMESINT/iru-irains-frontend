import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSectionHydrometServicesComponent } from './about-section-hydromet-services.component';

describe('AboutSectionHydrometServicesComponent', () => {
  let component: AboutSectionHydrometServicesComponent;
  let fixture: ComponentFixture<AboutSectionHydrometServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutSectionHydrometServicesComponent]
    });
    fixture = TestBed.createComponent(AboutSectionHydrometServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
