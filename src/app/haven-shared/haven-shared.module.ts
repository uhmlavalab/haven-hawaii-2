import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HavenMessageDialogComponent } from './haven-dialog/components/haven-message-dialog/haven-message-dialog.component';
import { HavenConfirmDialogComponent } from './haven-dialog/components/haven-confirm-dialog/haven-confirm-dialog.component';
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
import { HavenSavesessionDialogComponent } from './haven-dialog/components/haven-savesession-dialog/haven-savesession-dialog.component';


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
    HavenMessageDialogComponent,
    HavenConfirmDialogComponent,
    HavenSavesessionDialogComponent,
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
    HavenMessageDialogComponent,
    HavenConfirmDialogComponent,
    HavenSavesessionDialogComponent
  ],
  providers: [
    HavenDialogService
  ],
  entryComponents: [
    HavenMessageDialogComponent,
    HavenConfirmDialogComponent,
    HavenSavesessionDialogComponent
  ]
})
export class HavenSharedModule { }
