import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import { Attachment, Intervention } from '@shared/domain/intervention.model';
import { FileUtils } from '@shared/utils/file.utils';
import { ConfirmationDialog } from '@shared/components/confirmation-dialog.component';
import { InterventionsService } from '../../interventions.service';

@Component({
  selector: 'eko-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListComponent implements OnInit {
  @Input() attachments: Attachment[];
  @Input() interventionId: Intervention['id'];

  displayedColumns = ['type', 'name', 'size', 'actions'];
  dataSource: MatTableDataSource<Attachment>;
  fileUtils = FileUtils;

  constructor(
    private interventionsService: InterventionsService,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Attachment>(this.attachments);
  }

  onDownloadClick(file: Attachment) {
    this.interventionsService.downloadAttachment(this.interventionId, file).subscribe();
  }

  onDeleteClick(file: Attachment) {
    const dialogData = {
      title: 'Usuwanie pliku',
      contentText: 'Czy jesteś pewien, że chcesz usunąć ten plik?\nNie będzie go można przywrócić',
      primaryColor: 'warn' as const, // TypeScript don't hurt me, don't hurt me, no mo'? -.-
    };

    ConfirmationDialog.show(this.dialog, dialogData)
      .pipe(
        switchMap(confirmed =>
          confirmed
            ? this.interventionsService
                .deleteAttachment(this.interventionId, file)
                .pipe(tap(() => this.removeFromAttachmentsList(file)))
            : EMPTY,
        ),
      )
      .subscribe();
  }

  private removeFromAttachmentsList(file: Attachment) {
    const fileIndex = this.attachments.findIndex(attachment => attachment === file);
    this.attachments.splice(fileIndex, 1);
    this.dataSource.disconnect();
    this.dataSource = new MatTableDataSource<Attachment>(this.attachments);
    this.changeDetector.markForCheck();
  }
}
