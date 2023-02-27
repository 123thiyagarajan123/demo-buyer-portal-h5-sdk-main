import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonLinkFormComponent } from './button-link-form.component';

describe('ButtonLinkFormComponent', () => {
  let component: ButtonLinkFormComponent;
  let fixture: ComponentFixture<ButtonLinkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonLinkFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonLinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
