import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HavenMessageDialogComponent } from './haven-dialog/components/haven-message-dialog/haven-message-dialog.component';
import { HavenConfirmDialogComponent } from './haven-dialog/components/haven-confirm-dialog/haven-confirm-dialog.component';
import { HavenDialogService } from './haven-dialog/service/haven-dialog.service';
import { HavenLoadingDialogComponent } from './haven-dialog/components/haven-loading-dialog/haven-loading-dialog.component';

import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
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
import { MatGridListModule } from '@angular/material/grid-list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { HavenSavesessionDialogComponent } from './haven-dialog/components/haven-savesession-dialog/haven-savesession-dialog.component';
import { HavenScenarioConfigComponent } from './haven-dialog/components/haven-scenario-config/haven-scenario-config.component';
import { HavenScenarioEditComponent } from './haven-dialog/components/haven-scenario-edit/haven-scenario-edit.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDividerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatListModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
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
    HavenLoadingDialogComponent,
    HavenScenarioConfigComponent,
    HavenScenarioEditComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
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
    HavenSavesessionDialogComponent,
    HavenLoadingDialogComponent,
    HavenScenarioConfigComponent,
    HavenScenarioEditComponent
  ]
})
export class HavenSharedModule { }
