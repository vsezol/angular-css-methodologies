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
import { TimeRunnerComponent } from './components/time-runner/time-runner.component';
import { SharedModule } from './shared/shared.module';
import { ControlBarComponent } from './components/control-bar/control-bar.component';
import { TimeLogsListComponent } from './components/time-logs-list/time-logs-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TimeBarComponent,
    TimeBarPartComponent,
    ClockFaceComponent,
    TimeRunnerComponent,
    ControlBarComponent,
    TimeLogComponent,
    TimeLogsListComponent
  ],
  imports: [BrowserModule, AppRoutingModule, SharedModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: THEME_CONFIG_TOKEN,
      useValue: themeConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
