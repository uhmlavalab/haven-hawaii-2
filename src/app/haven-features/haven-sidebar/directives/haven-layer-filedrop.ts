import { Directive, HostListener, Output, EventEmitter } from '@angular/core';
import { LayerUploadService } from '@app/haven-core';

@Directive({
  selector: '[appHavenLayerFileDrop]'
})
export class HavenLayerFileDropDirective {

  constructor(private layerUploadService: LayerUploadService) { }

  @HostListener('drop', ['$event']) onDrop(event) {
    event.preventDefault();
    // If dropped items aren't files, reject them
    const dataTrans = event.dataTransfer;
    if (dataTrans.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < dataTrans.items.length; i++) {
        if (dataTrans.items[i].kind === 'file') {
          const file = dataTrans.items[i].getAsFile();
          this.layerUploadService.uploadFile(file);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < dataTrans.files.length; i++) {
        const file = dataTrans.items[i].getAsFile();
        this.layerUploadService.uploadFile(file);
      }
    }
  }

  @HostListener('dragover', ['$event']) onDragOver(event) {
    // event.preventDefault();
  }

  @HostListener('dragend', ['$event']) onDragEnd(event) {
    const dataTrans = event.dataTransfer;
    if (dataTrans.items) {
      // Use DataTransferItemList interface to remove the drag data
      for (let i = 0; i < dataTrans.items.length; i++) {
        dataTrans.items.remove(i);
      }
    } else {
      // Use DataTransfer interface to remove the drag data
      event.dataTransfer.clearData();
    }
  }

}
