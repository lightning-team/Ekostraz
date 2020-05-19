import { Component, Input, OnInit } from '@angular/core';
import { Attachment, Intervention } from '@shared/domain/intervention.model';
import { MatTableDataSource } from '@angular/material/table';
import { FileUtils } from '@shared/utils/file.utils';
import { InterventionsService } from '../../interventions.service';

@Component({
  selector: 'eko-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent implements OnInit {
  @Input() attachments: Attachment[];
  @Input() interventionId: Intervention['id'];

  displayedColumns = ['type', 'name', 'size', 'actions'];
  dataSource: MatTableDataSource<Attachment>;
  fileUtils = FileUtils;

  constructor(private interventionsService: InterventionsService) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Attachment>(this.attachments);
  }

  onDownloadClick(file: Attachment) {
    this.interventionsService.downloadAttachment(this.interventionId, file).subscribe();
  }
}
