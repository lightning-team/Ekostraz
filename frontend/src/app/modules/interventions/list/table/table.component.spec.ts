import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionsTableComponent } from './table.component';

describe('TableComponent', () => {
  let component: InterventionsTableComponent;
  let fixture: ComponentFixture<InterventionsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventionsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
