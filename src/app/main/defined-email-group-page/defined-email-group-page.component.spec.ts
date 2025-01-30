import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinedEmailGroupPageComponent } from './defined-email-group-page.component';

describe('DefinedEmailGroupPageComponent', () => {
  let component: DefinedEmailGroupPageComponent;
  let fixture: ComponentFixture<DefinedEmailGroupPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefinedEmailGroupPageComponent]
    });
    fixture = TestBed.createComponent(DefinedEmailGroupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
