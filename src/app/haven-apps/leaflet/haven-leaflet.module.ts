import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { HavenMaterialModule } from '../../haven-material/haven-material.module';

import { HavenLeafletComponent } from './component/haven-leaflet.component';

import { LayerDownloadService } from './services/layer-download.service';
import { LayerUploadService } from './services/layer-upload.service';
import { LayerColorsService } from './services/layer-colors.service';
import { MapStateService } from './services/map-state.service';


@NgModule({
  imports: [
    CommonModule,
    LeafletModule.forRoot(),
    HavenMaterialModule,
  ],
  declarations: [
    HavenLeafletComponent
  ],
  entryComponents: [
    HavenLeafletComponent
  ],
  providers: [
    LayerUploadService,
    LayerDownloadService,
    LayerColorsService,
    MapStateService,
  ]
})
export class HavenLeafletModule { }
