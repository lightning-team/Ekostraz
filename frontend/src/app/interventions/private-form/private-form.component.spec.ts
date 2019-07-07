import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateFormComponent } from './private-form.component';

describe('PrivateFormComponent', () => {
  let component: PrivateFormComponent;
  let fixture: ComponentFixture<PrivateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
