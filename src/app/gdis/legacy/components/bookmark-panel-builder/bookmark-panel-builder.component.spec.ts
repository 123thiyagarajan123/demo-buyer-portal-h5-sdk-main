import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkPanelBuilderComponent } from './bookmark-panel-builder.component';

describe('BookmarkPanelBuilderComponent', () => {
  let component: BookmarkPanelBuilderComponent;
  let fixture: ComponentFixture<BookmarkPanelBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookmarkPanelBuilderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkPanelBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
