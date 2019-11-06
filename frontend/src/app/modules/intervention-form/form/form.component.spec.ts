import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionFormComponent } from './form.component';

describe('FormComponent', () => {
  let component: InterventionFormComponent;
  let fixture: ComponentFixture<InterventionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InterventionFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
