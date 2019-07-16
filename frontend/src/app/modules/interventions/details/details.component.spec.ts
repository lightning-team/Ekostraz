import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionDetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  let component: InterventionDetailsComponent;
  let fixture: ComponentFixture<InterventionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
