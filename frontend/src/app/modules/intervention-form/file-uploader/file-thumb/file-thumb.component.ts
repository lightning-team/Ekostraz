import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileUtils, SupportedFileTypes } from '@shared/utils/file.utils';

@Component({
  selector: 'eko-file-thumb',
  templateUrl: './file-thumb.component.html',
  styleUrls: ['./file-thumb.component.scss'],
})
export class FileThumbComponent implements OnInit {
  @Input() file: File;
  @Output() fileRemove = new EventEmitter<File>();

  imgSource: string;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.setImgSourceByType(this.file.type);
  }

  private setImgSourceByType(type: string) {
    if (FileUtils.isFileType(type, SupportedFileTypes.Images)) {
      this.readFileAsDataUrl(this.file);
      return;
    }
    this.imgSource = FileUtils.thumbSourceForMimeType(this.file.type);
  }

  private readFileAsDataUrl(file: File): void {
    const reader = new FileReader();
    reader.onload = e => {
      this.imgSource = reader.result as string;
      this.changeDetector.markForCheck();
    };
    reader.readAsDataURL(file);
  }
}
