import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiDropdownComponent } from './mi-dropdown.component';

describe('GdisMiDropdownComponent', () => {
  let component: MiDropdownComponent;
  let fixture: ComponentFixture<MiDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
