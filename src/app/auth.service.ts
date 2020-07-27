import { WelcomeComponent } from './welcome/welcome.component';
import { urlParameters, tokenRequest, event_ } from './models/models';
import { environment } from './../environments/environment';
import { Injectable, OnInit, AfterContentInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject, Subscription } from 'rxjs';
import { SocialAuthService } from 'angularx-social-login';
import { DeviceUUID } from './../../node_modules/device-uuid'
import { DialogComponent } from './dialog/dialog.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

import * as jwt_decode from 'jwt-decode';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuthGuard, hasCustomClaim, customClaims } from '@angular/fire/auth-guard';

import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';


// const adminRole = () => { return hasCustomClaim('role') };
// const adminRole = () => pipe(customClaims, map(claims => claims.role === "admin"));

@Injectable({
  providedIn: 'root'
})



export class AuthService implements OnInit {

  public logEmitter = new Subject<event_>()

  public ifDocument = new Subject<boolean>()

  public tokenSubscription : Subscription

  public parametersSubscription : Subscription

  public documentSubscription : Subscription


  public isAdmin: boolean = false
  public isLogged: boolean = false
  public isSignedOut: boolean = false

  public userName: string = 'visitor'

  public customToken: string =''

  public tmp_id = new DeviceUUID().get()

  constructor(private route: ActivatedRoute,
    private router: Router,
    private hhtp: HttpClient,
    public db: AngularFirestore,
    public auth: AngularFireAuth,
    private dialog: MatDialog
  ) { }


  openDialog(text_?: string,) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: text_,

    };

    this.dialog.open(DialogComponent, dialogConfig);
  }

  receiveCustomTokenFromUsernamePassowrd(username_,password_){
    let tmp_token_req = {
      username: username_,
      password: password_  
    }
    return this.hhtp.post<string>(environment.backendURL + '/signInUser', tmp_token_req)
  }


  loginWithCustomToken(costomToken_){

    this.auth.signInWithCustomToken(costomToken_).then(usr => {

      let decoded_ = jwt_decode(costomToken_)
      console.log(decoded_)
      this.userName = decoded_.claims.userName

      sessionStorage.setItem('restaurantID',decoded_.claims.restaurantID)
      sessionStorage.setItem('restaurantName',decoded_.claims.restaurantName)
      sessionStorage.setItem('role',decoded_.claims.role)
      sessionStorage.setItem('userName',decoded_.claims.userName)


      
      if(decoded_.claims.role==='admin' || decoded_.claims.role=='owner'){

        this.isAdmin = true
      }

      this.isLogged = true
      this.emitCurrentLogin()

    })




  }


  requestToken(): Observable<string> {

    
    let tmp_token_req: tokenRequest = {
      uid: sessionStorage.getItem('uniqueID'),
      restaurantID: sessionStorage.getItem('restaurantID'),
      restaurantName: sessionStorage.getItem('restaurantName'),
      tableNumber: sessionStorage.getItem('tableNumber'),
      date: new Date().toDateString()
    }
    return this.hhtp.post<string>(environment.backendURL + '/returnToken', tmp_token_req)
  }


  setParameters(){
    this.parametersSubscription = this.route.queryParams.subscribe(parm => {
      console.log("THESE ARE URL PARAMETERs", parm)
      console.log(sessionStorage.getItem('token') )
      if (Object.keys(parm).length == 3) {
        let aaaa = JSON.stringify(parm)
        sessionStorage.setItem('urlParameters', aaaa)
        // setTimeout(()=>{},200);
        let tmp_id = new DeviceUUID().get()
        sessionStorage.setItem('uniqueID', tmp_id)
      }
      else{

        console.log("NO PARAMETERS")

        // this.openDialog("Please scan QR code")
        sessionStorage.setItem('urlParameters',null)
        let tmp_id = new DeviceUUID().get()
        sessionStorage.setItem('uniqueID', tmp_id)
      
      }
    })

    
  }


  loginWithToken() {

    let result: boolean
    this.auth.signInWithCustomToken(sessionStorage.getItem('customTokenVisitor')).then(usr => {
      console.log("LOGGED USER", usr );
      console.log(sessionStorage.getItem('restaurantID'),sessionStorage.getItem('deviceID'))

      this.documentSubscription = this.db.collection('restaurants').doc(sessionStorage.getItem('restaurantID')).collection('registrations').doc('visitors').collection(new Date().toDateString()).doc(sessionStorage.getItem('deviceID')).valueChanges().subscribe((el1) => {
        
        if(typeof el1 !== 'undefined' ){
        console.log("Read document",el1)
        result = true

        this.ifDocument.next(result)}
        else{

          this.ifDocument.next(false)

        }
      
    },error=>{
      
      console.log(error);

      result = false
      this.ifDocument.next(result)
      
      })



  
  })

  

  }
  
  ngOnInit() {}

  emitCurrentLogin() {
    let tmp_ee: event_ = {
      isAdmin: this.isAdmin,
      isLogged: this.isLogged,
      userName: this.userName,
      isSignedOut: this.isSignedOut,
      restaurantName: sessionStorage.getItem('restaurantName')
    }

    this.logEmitter.next(tmp_ee)
  }

  signOut() {

    this.tokenSubscription.unsubscribe()

    let tmp_ee: event_ = {
      isAdmin: false,
      isLogged: false,
      isSignedOut: true
    }

    this.logEmitter.next(tmp_ee)

    sessionStorage.clear()
    // return this.auth.signOut()

      
    // .catch(error => { console.log('there was an error') }).finally( ()=>this.router.navigate(['']))

  }




}




