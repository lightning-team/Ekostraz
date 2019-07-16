import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateEditFormComponent } from './private-edit-form.component';

describe('PrivateEditFormComponent', () => {
  let component: PrivateEditFormComponent;
  let fixture: ComponentFixture<PrivateEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
