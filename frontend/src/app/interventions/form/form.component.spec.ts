import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionsFormComponent } from './form.component';

describe('FormComponent', () => {
  let component: InterventionsFormComponent;
  let fixture: ComponentFixture<InterventionsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventionsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
