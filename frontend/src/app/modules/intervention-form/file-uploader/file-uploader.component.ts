import { Component, Input, OnInit } from '@angular/core';
import { createFadeInOut } from '@shared/animations';
import { FileUtils, SupportedFileTypes } from '@shared/utils/file.utils';

@Component({
  selector: 'eko-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  animations: [createFadeInOut(300, 200)],
})
export class FileUploaderComponent implements OnInit {
  @Input() imagesOnly = false;

  files: Array<File> = [];
  addFilesMessage: string;
  acceptedFileTypes: string;

  ngOnInit(): void {
    this.addFilesMessage = `Dodaj ${this.imagesOnly ? 'zdjęcia' : 'pliki'}`;
    this.acceptedFileTypes = this.imagesOnly ? SupportedFileTypes.Images : FileUtils.allSupportedTypes().join(',');
  }

  openFileBrowser(input: HTMLInputElement) {
    input.click();
  }

  onFilesSelected(input: HTMLInputElement) {
    const newFiles = this.filterExistingFiles(input.files, this.files);
    this.files = this.files.concat(newFiles);
  }

  private filterExistingFiles(inputFiles: FileList, existingFiles: File[]) {
    return Array.from(inputFiles).filter(
      addedFile =>
        !existingFiles.find(
          existingFile =>
            existingFile.name === addedFile.name &&
            existingFile.type === addedFile.type &&
            existingFile.size === addedFile.size,
        ),
    );
  }

  onFileRemove(removedFile: File, input: HTMLInputElement) {
    this.files = this.files.filter(file => file !== removedFile);
    input.value = '';
  }
}
