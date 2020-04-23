import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TreeContainerComponent } from './tree/tree-container/tree-container.component';
import { TreeNodeComponent } from './tree/tree-node/tree-node.component';

@NgModule({
  declarations: [AppComponent, TreeNodeComponent, TreeContainerComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, MatSelectModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
