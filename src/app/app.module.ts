import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TreeContainerComponent } from './tree/tree-container/tree-container.component';
import { TreeNodeComponent } from './tree/tree-node/tree-node.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphicComponent } from './graphic/graphic.component';

@NgModule({
  declarations: [AppComponent, TreeNodeComponent, TreeContainerComponent, GraphicComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
