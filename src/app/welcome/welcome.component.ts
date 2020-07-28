import { DialogComponent } from './../dialog/dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from './../auth.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { DeviceUUID } from './../../../node_modules/device-uuid'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
// import {SocialUser ,SocialAuthService, GoogleLoginProvider } from "angularx-social-login";
import {urlParameters,tokenRequest, event_} from './../models/models'
import { Subscription } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})

export class WelcomeComponent implements OnInit {
  error_

  parametersSubscription: Subscription

  spinner_value = 0

  ifDocument: boolean 

  isSpinner: boolean = false

  customTokenSubscription: Subscription 
  loggedWithGoogle: boolean = false

  isAdmin: boolean = false
  isLogged: boolean = false
  isSignedOut: boolean = false
  readonly_ = false

  parameters: urlParameters = {
    restaurant_id : "",
    table_number: "",
    restaurant_name:""
  }

  
  tmp_id = new DeviceUUID().get()

  form_: FormGroup = new FormGroup({
    name_: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    phone_: new FormControl(null, [Validators.required, Validators.maxLength(16)]),
    email_: new FormControl(null,[Validators.email,Validators.required,Validators.maxLength(120)])
  })

  // user: SocialUser 

  constructor(
      private route: ActivatedRoute,
      public router: Router,
       public srv: AuthService, 
      // private auth: AngularFireAuth,
      // private authService: SocialAuthService,
      // private http: HttpClient,
      private dialog: MatDialog
      ) { }

  
  ngOnInit(): void {

    this.srv.ifDocument.subscribe(res=>{

      if(res==true){

        this.openDialog('You have already submitted data.Thank you.')
        this.form_.disable()

        this.srv.documentSubscription.unsubscribe()

        this.srv.ifDocument.unsubscribe()


      }else{

        this.openDialog('Please submit your registration data')

        this.srv.ifDocument.unsubscribe()

      }
    })

      


    this.parametersSubscription = this.route.queryParams.subscribe(parm => {
      console.log("THESE ARE URL PARAMETERs", parm)
      console.log(sessionStorage.getItem('token') )
      if (Object.keys(parm).length == 3) {
       
          let tmp_id = new DeviceUUID().get()

          sessionStorage.setItem('deviceID', tmp_id)
          sessionStorage.setItem('restaurantID',parm.restaurantID)
          sessionStorage.setItem('restaurantName',parm.restaurantName)
          sessionStorage.setItem('tableNumber',parm.tableNumber)
      }
      else{
        console.log("NO PARAMETERS")
        this.openDialog("Please scan QR code")
        sessionStorage.setItem('urlParameters',null)
        let tmp_id = new DeviceUUID().get()
        sessionStorage.setItem('uniqueID', tmp_id)
        this.form_.disable()
      
      }
    },error=>{console.log("There was an error with query parameters", error)})
    
    this.srv.requestToken().subscribe(tok=>{console.log('token',tok);
      sessionStorage.setItem('customTokenVisitor', tok['token'])

      if (tok['token']!=='noToken'){

        let decoded = jwt_decode(tok['token'])

        sessionStorage.setItem('uid', decoded['uid'])

        this.srv.loginWithToken()

      }
    }

    )
  }

  // signInWithGoogle() {
  //   const googleLoginOptions =  {
  //     scope: 'profile email'
  //   }; 

  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((rr)=>{console.log("RESULT", rr);
  //   this.form_.patchValue({'name_': rr.name});
  //   this.form_.patchValue({'email_': rr.email});

  //   this.readonly_=true
  //   this.srv.isAdmin=true
  //   this.srv.isLogged = true
    
  //   this.srv.emitCurrentLogin()

  //   console.log("GOOGLE TOKEN", rr)

  //   sessionStorage.setItem('token', rr.idToken)

  //   this.srv.loginWithToken()


  
  // }).catch(error=>console.log("Error"))
  
   
  // }


  resetForm(){

    this.form_.reset()
      this.form_.get('phone_').updateValueAndValidity()
  }


  openDialog(text_?:string, ) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {

      id: 1,
      title: text_,
      
  };

    this.dialog.open(DialogComponent, dialogConfig);
}



  submitForm() {

    this.isSpinner = true
    let tmp_date = new Date().toDateString()

    let restaurantID = sessionStorage.getItem('restaurantID')

    let bbb = sessionStorage.getItem('uniqueID')

    this.srv.db.collection('restaurants').doc(restaurantID).collection('registrations').doc('visitors').collection(new Date().toDateString()).doc(sessionStorage.getItem('deviceID')).set(this.form_.value).then((el1) => {

      console.log("EL1", el1)

      this.isSpinner = false
      this.openDialog("Thank you for submitting registration data")

      this.form_.reset()

      this.form_.disable()
    })


  //   this.srv.db.collection('restaurants').doc(restaurantID).collection(tmp_date).doc(bbb).set(this.form_.value).then((el1) => {

  //     console.log("response structure",el1)
    
  //     let txt_ = `Thank you for submitting your data.`
  //     // this.alreadySignedIn =true

  //     this.isSpinner = false
  //     this.form_.disable()

  //     this.openDialog(txt_)

  //     this.form_.reset()

  //   }).catch(error => {
  //     console.log('there was an error')
  //     this.isSpinner = false
  //   })

  // }

  }

}


