import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailDisseminationPageComponent } from './email-dissemination-page.component';

describe('EmailDisseminationPageComponent', () => {
  let component: EmailDisseminationPageComponent;
  let fixture: ComponentFixture<EmailDisseminationPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailDisseminationPageComponent]
    });
    fixture = TestBed.createComponent(EmailDisseminationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
