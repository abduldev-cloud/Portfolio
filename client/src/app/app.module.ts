import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './app-route-reuse.strategy';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ProjectsSectionComponent } from './projects-section/projects-section.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsSectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: CustomReuseStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
