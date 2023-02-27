import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiNavigationComponent } from './mi-navigation.component';

describe('MiNavigationComponent', () => {
  let component: MiNavigationComponent;
  let fixture: ComponentFixture<MiNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiNavigationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
