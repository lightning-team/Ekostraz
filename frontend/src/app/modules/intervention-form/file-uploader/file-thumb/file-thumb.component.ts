import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SupportedFileTypes } from '@interventionForm/file-uploader/file-uploader.component';

@Component({
  selector: 'eko-file-thumb',
  templateUrl: './file-thumb.component.html',
  styleUrls: ['./file-thumb.component.scss'],
})
export class FileThumbComponent implements OnInit {
  @Input() file: File;
  @Output() fileRemove = new EventEmitter<File>();

  imgSource: string;
  fileName: string;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.setImgSourceByType(this.file.type);
    this.fileName = this.file.name;
  }

  private setImgSourceByType(type: string) {
    if (this.isFileType(type, SupportedFileTypes.Images)) {
      this.readFileAsDataUrl();
      return;
    }
    this.imgSource = this.getThumbImageSourceBy(type);
  }

  private getThumbImageSourceBy(type: string) {
    if (this.isFileType(type, SupportedFileTypes.Pdf)) {
      return 'assets/pdf-file-thumb.png';
    } else if (this.isFileType(type, SupportedFileTypes.WordDocument)) {
      return 'assets/doc-file-thumb.png';
    } else if (this.isFileType(type, SupportedFileTypes.Text)) {
      return 'assets/txt-file-thumb.png';
    } else if (this.isFileType(type, SupportedFileTypes.Video)) {
      return 'assets/video-file-thumb.png';
    } else if (this.isFileType(type, SupportedFileTypes.Audio)) {
      return 'assets/audio-file-thumb.png';
    } else {
      return 'assets/other-file-thumb.png';
    }
  }

  private readFileAsDataUrl(): void {
    const reader = new FileReader();
    reader.onload = e => {
      this.imgSource = reader.result as string;
      this.changeDetector.markForCheck();
    };
    reader.readAsDataURL(this.file);
  }

  private isFileType(actualType: string, expectedType: SupportedFileTypes): boolean {
    return actualType.includes(expectedType.replace('/*', '/'));
  }
}
