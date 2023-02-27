import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorFormComponent } from './monitor-form.component';

describe('MonitorFormComponent', () => {
  let component: MonitorFormComponent;
  let fixture: ComponentFixture<MonitorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitorFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
