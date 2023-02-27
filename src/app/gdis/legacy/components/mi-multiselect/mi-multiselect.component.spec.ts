import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiMultiselectComponent } from './mi-multiselect.component';

describe('MiMultiselectComponent', () => {
  let component: MiMultiselectComponent;
  let fixture: ComponentFixture<MiMultiselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiMultiselectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
