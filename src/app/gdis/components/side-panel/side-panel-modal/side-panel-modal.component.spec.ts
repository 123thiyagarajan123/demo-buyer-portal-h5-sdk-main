import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelModalComponent } from './side-panel-modal.component';

describe('SidePanelModalComponent', () => {
  let component: SidePanelModalComponent;
  let fixture: ComponentFixture<SidePanelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidePanelModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePanelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
