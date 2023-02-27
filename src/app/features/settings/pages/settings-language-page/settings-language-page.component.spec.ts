import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLanguagePageComponent } from './settings-language-page.component';

describe('SettingsLanguagePageComponent', () => {
  let component: SettingsLanguagePageComponent;
  let fixture: ComponentFixture<SettingsLanguagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsLanguagePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLanguagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
