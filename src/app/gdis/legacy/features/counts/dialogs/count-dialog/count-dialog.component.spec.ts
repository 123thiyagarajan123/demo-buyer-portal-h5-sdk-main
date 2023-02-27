import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonLinkDialogComponent } from './button-link-dialog.component';

describe('ButtonLinkDialogComponent', () => {
  let component: ButtonLinkDialogComponent;
  let fixture: ComponentFixture<ButtonLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonLinkDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
