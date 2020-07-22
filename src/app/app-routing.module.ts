import { QrGenComponent } from './qr-gen/qr-gen.component';
import { HomeComponent } from './home/home.component';
import { AdminSiteComponent } from './admin-site/admin-site.component';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AngularFireAuthGuard, hasCustomClaim ,customClaims} from '@angular/fire/auth-guard';

import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';


// const adminRole = () => { return hasCustomClaim('role') };
const adminRole = () => pipe(customClaims, map(claims => claims.role === "admin"));

const routes: Routes = [{path:'registration', component: WelcomeComponent},
{path:'adminsite', component: AdminSiteComponent,canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminRole }},
{path: 'qrgen', component: QrGenComponent,canActivate: [AngularFireAuthGuard], data:{authGuardPipe: adminRole}},
//, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminRole }
{path:'home',component: HomeComponent},
{path:'',component: HomeComponent}]
// , canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminRole }}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


