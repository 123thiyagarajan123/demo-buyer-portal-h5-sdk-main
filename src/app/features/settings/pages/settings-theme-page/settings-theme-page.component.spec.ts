import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsThemePageComponent } from './settings-theme-page.component';

describe('SettingsThemePageComponent', () => {
  let component: SettingsThemePageComponent;
  let fixture: ComponentFixture<SettingsThemePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsThemePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsThemePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
