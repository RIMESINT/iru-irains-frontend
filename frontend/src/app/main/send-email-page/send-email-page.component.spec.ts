import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailPageComponent } from './send-email-page.component';

describe('SendEmailPageComponent', () => {
  let component: SendEmailPageComponent;
  let fixture: ComponentFixture<SendEmailPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendEmailPageComponent]
    });
    fixture = TestBed.createComponent(SendEmailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
