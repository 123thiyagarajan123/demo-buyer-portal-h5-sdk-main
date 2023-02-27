import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSizePageComponent } from './settings-size-page.component';

describe('SettingsSizePageComponent', () => {
  let component: SettingsSizePageComponent;
  let fixture: ComponentFixture<SettingsSizePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsSizePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSizePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
