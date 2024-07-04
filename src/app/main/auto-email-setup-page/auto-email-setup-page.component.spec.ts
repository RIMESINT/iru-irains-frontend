import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoEmailSetupPageComponent } from './auto-email-setup-page.component';

describe('AutoEmailSetupPageComponent', () => {
  let component: AutoEmailSetupPageComponent;
  let fixture: ComponentFixture<AutoEmailSetupPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoEmailSetupPageComponent]
    });
    fixture = TestBed.createComponent(AutoEmailSetupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
