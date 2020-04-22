import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'eko-file-thumb',
  template: '',
})
export class FileThumbMockComponent {
  @Input() file: File;
  @Output() fileRemove = new EventEmitter<File>();
}
