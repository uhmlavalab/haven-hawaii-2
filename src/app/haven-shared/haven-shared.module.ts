import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HavenDialogComponent } from './haven-dialog/component/haven-dialog.component';
import { HavenDialogService } from './haven-dialog/service/haven-dialog.service';

import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSortModule,
  MatStepperModule,
  MatToolbarModule,
  MatTooltipModule,
  MatPaginatorModule,
} from '@angular/material';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSortModule,
    MatStepperModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTableModule
  ],
  declarations: [
    HavenDialogComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSortModule,
    MatStepperModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTableModule,
    HavenDialogComponent
  ],
  providers: [
    HavenDialogService
  ]
})
export class HavenSharedModule { }
