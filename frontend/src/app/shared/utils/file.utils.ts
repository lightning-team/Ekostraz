export enum SupportedFileTypes {
  Images = 'image/*',
  Pdf = 'application/pdf',
  WordDocument = 'application/msword',
  Text = 'text/plain',
  Video = 'video/*',
  Audio = 'audio/*',
}

export class FileUtils {
  static getSizeText(size: number) {
    if (size < 1024) {
      // up to 1KB
      return '1KB';
    }
    if (size < 1024 * 500) {
      // up to 500KB
      return ((size / 1024) | 0) + 'KB'; // tslint:disable-line
    }
    if (size < 1024 * 1024 * 100) {
      // up to 100MB
      return (size / (1024 * 1024)).toPrecision(2) + 'MB';
    }
    if (size < 1024 * 1024 * 1024) {
      // up to 10MB
      return ((size / (1024 * 1024)) | 0) + 'MB'; // tslint:disable-line
    }
    return '>1GB';
  }

  static thumbSourceForMimeType(type: string) {
    if (this.isFileType(type, SupportedFileTypes.Images)) {
      return 'assets/image-file-thumb.png';
    } else if (this.isFileType(type, SupportedFileTypes.Pdf)) {
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

  static isFileType(actualType: string, expectedType: SupportedFileTypes): boolean {
    return actualType.includes(expectedType.replace('/*', '/'));
  }

  static allSupportedTypes(): SupportedFileTypes[] {
    return Object.values(SupportedFileTypes);
  }
}
