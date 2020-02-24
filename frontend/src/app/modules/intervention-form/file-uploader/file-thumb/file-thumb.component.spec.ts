import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileThumbComponent } from './file-thumb.component';

describe('FileThumbComponent', () => {
  let component: FileThumbComponent;
  let fixture: ComponentFixture<FileThumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileThumbComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileThumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
