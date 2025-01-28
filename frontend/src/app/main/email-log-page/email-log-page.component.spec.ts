import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLogPageComponent } from './email-log-page.component';

describe('EmailLogPageComponent', () => {
  let component: EmailLogPageComponent;
  let fixture: ComponentFixture<EmailLogPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailLogPageComponent]
    });
    fixture = TestBed.createComponent(EmailLogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
