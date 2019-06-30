import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionsMapComponent } from './map.component';

describe('MapComponent', () => {
  let component: InterventionsMapComponent;
  let fixture: ComponentFixture<InterventionsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventionsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
