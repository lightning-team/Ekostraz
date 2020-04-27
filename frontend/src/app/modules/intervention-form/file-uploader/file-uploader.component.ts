import { Component, Input, OnInit } from '@angular/core';

export enum SupportedFileTypes {
  Images = 'image/*',
  Pdf = 'application/pdf',
  WordDocument = 'application/msword',
  Text = 'text/plain',
  Video = 'video/*',
  Audio = 'audio/*',
}

@Component({
  selector: 'eko-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {
  @Input() imagesOnly = false;

  files: Array<File> = [];
  addFilesMessage: string;
  acceptedFileTypes: string;

  ngOnInit(): void {
    this.addFilesMessage = `Dodaj ${this.imagesOnly ? 'zdjęcia' : 'pliki'}`;
    this.acceptedFileTypes = this.imagesOnly ? SupportedFileTypes.Images : this.getAllSupportedTypes();
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

  private getAllSupportedTypes(): string {
    return Object.values(SupportedFileTypes).join(',');
  }
}
