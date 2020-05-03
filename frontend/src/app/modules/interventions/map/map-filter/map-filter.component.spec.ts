import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFilterComponent } from './map-filter.component';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatCard } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MapFilterComponent', () => {
  let component: MapFilterComponent;
  let fixture: ComponentFixture<MapFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatRippleModule, NoopAnimationsModule],
      declarations: [MapFilterComponent, MatRadioGroup, MatRadioButton, MatCard, MatIcon],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
