import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs'
import {MatInputModule} from '@angular/material/input'
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatGridListModule} from '@angular/material/grid-list'
import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule } from "@angular/flex-layout";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {MatProgressBarModule} from '@angular/material/progress-bar';




@NgModule({
  declarations: [],
  imports: [
    MatProgressBarModule,

    MatProgressSpinnerModule,
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatGridListModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
  ],
  exports: [
    MatProgressBarModule,
    MatProgressSpinnerModule,
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatGridListModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule

  ]
})
export class MaterialModule { }
