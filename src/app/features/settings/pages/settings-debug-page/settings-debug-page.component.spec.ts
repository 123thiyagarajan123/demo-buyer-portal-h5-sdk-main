import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDebugPageComponent } from './settings-debug-page.component';

describe('SettingsDebugPageComponent', () => {
  let component: SettingsDebugPageComponent;
  let fixture: ComponentFixture<SettingsDebugPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsDebugPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDebugPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
