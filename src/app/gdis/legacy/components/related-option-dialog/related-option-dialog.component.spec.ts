import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedOptionDialogComponent } from './related-option-dialog.component';

describe('RelatedOptionDialogComponent', () => {
  let component: RelatedOptionDialogComponent;
  let fixture: ComponentFixture<RelatedOptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatedOptionDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedOptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
