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
const adminRole = () => pipe(customClaims, map(claims => claims.role === "admin"));

@Injectable({
  providedIn: 'root'
})



export class AuthService implements OnInit {

  public logEmitter = new Subject<event_>()

  public tokenSubscription : Subscription

  public parametersSubscription : Subscription


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
      
      if(decoded_.claims.role==='admin' || decoded_.claims.role=='owner'){

        this.isAdmin = true
      }

      this.isLogged = true
      this.emitCurrentLogin()

    })




  }

  







  requestToken(): Observable<string> {

    // let tmp_params: urlParameters = {
    //   restaurant_id: '',
    //   table_number: '0',
    //   restaurant_name: ''
    // }

    let tmp_params

    try{

      tmp_params = JSON.parse(sessionStorage.getItem('urlParameters'))

    }catch{

      tmp_params = null
 
    }
    // let tmp_params = JSON.parse(sessionStorage.getItem('urlParameters'))
    let tmp_token_req: tokenRequest = {
      uid: sessionStorage.getItem('uniqueID'),
      parameters: tmp_params,
      date: new Date().toDateString()
    }
    return this.hhtp.post<string>(environment.backendURL + '/returnToken', tmp_token_req)
  }


  setParameters(){
    this.parametersSubscription = this.route.queryParams.subscribe(parm => {
      console.log("THESE ARE URL PARAMETERs", parm)
      console.log(sessionStorage.getItem('token') )
      if (Object.keys(parm).length == 3 || sessionStorage.getItem('token') !== null) {
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
        this.isAdmin = false
        this.isLogged = false
        this.emitCurrentLogin()

        
      }
    })

    
  }


  loginWithToken() {
    this.setParameters()
    setTimeout(()=>{},500)
    this.parametersSubscription.unsubscribe()
    this.tokenSubscription = this.requestToken().subscribe(tok => {
      if (tok['token'] == "noToken") {
        this.isAdmin = false
        this.isLogged = false
        this.emitCurrentLogin()
        // this.openDialog("Please scan QR code: 123")
      }
      else {


        sessionStorage.setItem('customToken1', tok['token'])

        

        // this.auth.setPersistence('local').then(el=>{console.log("PERSISTENT",el);


        this.auth.signInWithCustomToken(tok['token']).then(usr => {

          this.customToken = tok['token']
          console.log("CustomToken", this.customToken)
          this.auth.currentUser.then(el => {
            el.getIdToken().then(tok => {
              let decoded_ = jwt_decode(tok)

              sessionStorage.setItem('restaurant_name',decoded_['restaurant_name'])
              console.log("DECODE", decoded_)
              if (decoded_['role'] === 'admin') {
                this.isAdmin = true
                this.userName = decoded_['email']
              } else {
                this.isAdmin = false
              }
              this.isLogged = true


              
              console.log("IsAdmin,IsLogged,userName", this.isAdmin, this.isLogged, this.userName)
              this.emitCurrentLogin()
            }).catch(error => console.log('There was an error during signIn process'))
          }).catch(el2 => {
          })
          }
        )
        
      }
    })
  }
  
  ngOnInit() {

    // this.auth.user.subscribe(el=>console.log('user', el))

    
    // this.auth.onAuthStateChanged(el => {
    //   console.log("USER STATUS CHANGED")
    // })
  }

  emitCurrentLogin() {
    let tmp_ee: event_ = {
      isAdmin: this.isAdmin,
      isLogged: this.isLogged,
      userName: this.userName,
      isSignedOut: this.isSignedOut
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




