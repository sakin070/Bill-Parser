import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RectorComponent } from './rector/rector.component';
import { SelectionCanvasComponent } from './selection-canvas/selection-canvas.component';
import { ConfigTableComponent } from './config-table/config-table.component';

@NgModule({
  declarations: [
    AppComponent,
    RectorComponent,
    SelectionCanvasComponent,
    ConfigTableComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
