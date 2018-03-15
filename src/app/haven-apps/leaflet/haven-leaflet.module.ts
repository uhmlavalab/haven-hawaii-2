import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { HavenLeafletComponent } from './component/haven-leaflet.component';


@NgModule({
  imports: [
    CommonModule,
    LeafletModule.forRoot(),
  ],
  declarations: [
    HavenLeafletComponent
  ],
  entryComponents: [
    HavenLeafletComponent
  ]
})
export class HavenLeafletModule { }
