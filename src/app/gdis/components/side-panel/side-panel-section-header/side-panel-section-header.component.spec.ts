import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelSectionHeaderComponent } from './side-panel-section-header.component';

describe('SidePanelSectionHeaderComponent', () => {
  let component: SidePanelSectionHeaderComponent;
  let fixture: ComponentFixture<SidePanelSectionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidePanelSectionHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePanelSectionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
