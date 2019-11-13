import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule, MatDialogModule, MatCardModule, MatInputModule, MatSlideToggleModule, MatSelectModule, MatProgressBarModule } from '@angular/material';
import { ExampleComponent } from './example/example.component';
import { MonitorComponent } from './monitor/monitor.component';
import { FormsModule } from '@angular/forms';
import { IdentifyComponent } from './identify/identify.component';

@NgModule({
  declarations: [
    AppComponent,
    ExampleComponent,
    MonitorComponent,
    IdentifyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
