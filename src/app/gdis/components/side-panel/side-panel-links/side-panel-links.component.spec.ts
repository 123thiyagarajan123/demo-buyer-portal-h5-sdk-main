import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelLinksComponent } from './side-panel-links.component';

describe('SidePanelLinksComponent', () => {
  let component: SidePanelLinksComponent;
  let fixture: ComponentFixture<SidePanelLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidePanelLinksComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePanelLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
