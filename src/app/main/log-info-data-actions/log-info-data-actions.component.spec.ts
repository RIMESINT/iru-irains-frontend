import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInfoDataActionsComponent } from './log-info-data-actions.component';

describe('LogInfoDataActionsComponent', () => {
  let component: LogInfoDataActionsComponent;
  let fixture: ComponentFixture<LogInfoDataActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogInfoDataActionsComponent]
    });
    fixture = TestBed.createComponent(LogInfoDataActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
