import {
  MatAutocompleteModule,
  MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule, MatPaginatorModule, MatProgressBarModule,
  MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSliderModule, MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {NgModule} from '@angular/core';
import {CdkTableModule} from '@angular/cdk/table';

const modules = [
  MatInputModule,
  MatToolbarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatMenuModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTabsModule,
  MatTooltipModule,
  MatButtonToggleModule,
  MatSliderModule,
  MatDialogModule,
  MatRippleModule,
  MatSelectModule,
  MatListModule,
  MatTableModule,
  CdkTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatRadioModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatProgressBarModule,
  MatSlideToggleModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {
}
