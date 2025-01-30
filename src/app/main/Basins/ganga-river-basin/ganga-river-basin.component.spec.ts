import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GangaRiverBasinComponent } from './ganga-river-basin.component';

describe('GangaRiverBasinComponent', () => {
  let component: GangaRiverBasinComponent;
  let fixture: ComponentFixture<GangaRiverBasinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GangaRiverBasinComponent]
    });
    fixture = TestBed.createComponent(GangaRiverBasinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
