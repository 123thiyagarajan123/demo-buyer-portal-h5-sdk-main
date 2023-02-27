import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { M3OdinModule } from '@infor-up/m3-odin-angular';

import {
  errorHandler,
  localeInitializer,
  userContextInitializer,
  translationConfiguration,
  translationLoader,
  translationInitializer,
} from '@core/providers';
import { routeReuseStrategy } from '@core/providers/route-reuse-strategy.provider';

import { SharedModule } from '@shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    M3OdinModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    localeInitializer,
    userContextInitializer,
    errorHandler,
    translationConfiguration,
    translationLoader,
    translationInitializer,
    routeReuseStrategy,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
