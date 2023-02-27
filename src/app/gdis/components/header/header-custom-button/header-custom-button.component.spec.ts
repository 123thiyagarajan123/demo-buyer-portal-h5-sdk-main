import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCustomButtonComponent } from './header-custom-button.component';

describe('HeaderCustomButtonComponent', () => {
  let component: HeaderCustomButtonComponent;
  let fixture: ComponentFixture<HeaderCustomButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderCustomButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderCustomButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
