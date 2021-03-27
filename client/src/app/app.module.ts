import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import {MatButtonModule} from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatRadioModule} from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';


import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { ContextPackListComponent } from './contextpacks/contextpack-list.component';
import { ContextPackService } from './contextpacks/contextpack.service';
import { ContextPackCardComponent } from './contextpacks/contextpack-card.component';
import { ContextPackInfoComponent } from './contextpacks/contextpack-info.component';
import { AddContextpacksComponent } from './contextpacks/add-contextpacks.component';
import { EditContextpackComponent } from './contextpacks/edit-contextpack.component';

const MATERIAL_MODULES: any[] = [
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
  MatMenuModule,
  MatSidenavModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatSelectModule,
  MatOptionModule,
  MatFormFieldModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContextPackCardComponent,
    ContextPackListComponent,
    ContextPackInfoComponent,
    AddContextpacksComponent,
    EditContextpackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MATERIAL_MODULES,
    LayoutModule
  ],
  providers: [
    ContextPackService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
