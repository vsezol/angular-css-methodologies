import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimeLogComponent } from './components/time-log/time-log.component';
import { TimeBarComponent } from './components/time-bar/time-bar.component';
import { THEME_CONFIG_TOKEN } from './constants/tokens/theme-config.token';
import { themeConfig } from './configs/theme.config';
import { TimeBarPartComponent } from './components/time-bar/components/time-bar-part.component';
import { ClockFaceComponent } from './components/time-bar/components/clock-face.component';

@NgModule({
  declarations: [AppComponent, TimeLogComponent, TimeBarComponent, TimeBarPartComponent, ClockFaceComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    {
      provide: THEME_CONFIG_TOKEN,
      useValue: themeConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
