import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiLookupComponent } from './mi-lookup.component';

describe('MiLookupComponent', () => {
  let component: MiLookupComponent;
  let fixture: ComponentFixture<MiLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiLookupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
