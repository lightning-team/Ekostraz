import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopNavComponent } from './desktop-nav.component';

describe('DesktopNavComponent', () => {
  let component: DesktopNavComponent;
  let fixture: ComponentFixture<DesktopNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
