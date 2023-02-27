import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedOptionComponent } from './related-option.component';

describe('RelatedOptionComponent', () => {
  let component: RelatedOptionComponent;
  let fixture: ComponentFixture<RelatedOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatedOptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
