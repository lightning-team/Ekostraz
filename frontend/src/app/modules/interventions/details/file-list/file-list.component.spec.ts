import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileListComponent } from './file-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InterventionsService } from '../../interventions.service';
import { MatDialog } from '@angular/material/dialog';

describe('FileListComponent', () => {
  let component: FileListComponent;
  let fixture: ComponentFixture<FileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTableModule, MatIconModule, MatButtonModule],
      declarations: [FileListComponent],
      providers: [
        { provide: InterventionsService, useValue: {} },
        { provide: MatDialog, useValue: {} },
      ], // TODO: Replace with real mock for tests
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
