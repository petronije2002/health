import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';

import {MaterialModule} from './material/material/material.module'
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import {DBService} from './db.service'
import { QRCodeModule } from 'angularx-qrcode';

import { RouterModule } from '@angular/router';

import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
} from 'angularx-social-login';

import { MenuComponent } from './menu/menu.component';
import { DialogComponent } from './dialog/dialog.component';
import { AdminSiteComponent } from './admin-site/admin-site.component';
import { HomeComponent } from './home/home.component';
import { QrGenComponent } from './qr-gen/qr-gen.component';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy} from '@angular/common';




@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    MenuComponent,
    DialogComponent,
    AdminSiteComponent,
    HomeComponent,
    QrGenComponent
  ],
  imports: [
    RouterModule,
    QRCodeModule,
    HammerModule,
    ReactiveFormsModule,

    MaterialModule,
    SocialLoginModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    HttpClientModule,

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy },
    DBService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
               "344106497166-cdlji51ggoo1s893fjufar3memsmbvk8.apps.googleusercontent.com"
            ),
          }     
        ],
      } as SocialAuthServiceConfig,
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
