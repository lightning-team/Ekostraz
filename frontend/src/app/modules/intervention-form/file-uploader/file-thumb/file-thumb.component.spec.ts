import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { FileThumbComponent } from './file-thumb.component';

describe('FileThumbComponent', () => {
  let component: FileThumbComponent;
  let fixture: ComponentFixture<FileThumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [FileThumbComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileThumbComponent);

    component = fixture.componentInstance;
    component.file = new File(['testdata'], 'fake-file.txt', { type: 'text/plain' });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
