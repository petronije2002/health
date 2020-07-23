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
import {SocialUser ,SocialAuthService, GoogleLoginProvider } from "angularx-social-login";
import {urlParameters,tokenRequest, event_} from './../models/models'
import { Subscription } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})

export class WelcomeComponent implements OnInit {
  error_

  spinner_value = 0

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
    name_: new FormControl(null, Validators.required),
    phone_: new FormControl(null, Validators.required),
    email_: new FormControl(null)

  })

  user: SocialUser 

  constructor(
      public router: Router,
       public srv: AuthService, 
      // private auth: AngularFireAuth,
      private authService: SocialAuthService,
      // private http: HttpClient,
      private dialog: MatDialog
      ) { }

  

  ngOnInit(): void {


    this.srv.logEmitter.subscribe(ev=>{
      this.isAdmin = ev.isAdmin
      this.isLogged = ev.isLogged

      if(ev.isSignedOut===true){

        console.log("The signe out event is:", ev.isSignedOut)
        
        // sessionStorage.clear()
        
        this.srv.logEmitter.unsubscribe()
        this.srv.auth.signOut().then(el=>{console.log("singedout")})
        this.form_.reset()
        this.form_.disable()

      }
    })
    
      this.srv.loginWithToken()
      setTimeout(()=>{this.srv.auth.currentUser.then(cur=>{console.log("Current user is1234:", cur)})

      this.srv.db.collection('restaurants').doc('bukowsky').collection(new Date().toDateString()).doc(sessionStorage.getItem('uniqueID')).valueChanges().subscribe(dd=>{console.log("document",dd);
      // 
      if(dd){
        this.openDialog("You have already submitted registration data. Thank you")
        this.form_.disable()


      }
      // 
    },error=>{

      

      if(this.srv.isLogged==false && this.srv.isSignedOut===false){

        this.openDialog("Please scan QR code")

        this.form_.disable()

        return
      }


      if(this.srv.isSignedOut==false){
        // this.openDialog("Please submit registration data")
        console.log(error);
        
      }
      if(this.srv.isSignedOut===true){

        this.openDialog("You are signed out.Thank you for using BarPass")




        
      }

      
    })

  },2000)
  
  }

  signInWithGoogle() {
    const googleLoginOptions =  {
      scope: 'profile email'
    }; 

    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((rr)=>{console.log("RESULT", rr);
    this.form_.patchValue({'name_': rr.name});
    this.form_.patchValue({'email_': rr.email});

    this.readonly_=true
    this.srv.isAdmin=true
    this.srv.isLogged = true
    
    this.srv.emitCurrentLogin()

    console.log("GOOGLE TOKEN", rr)

    sessionStorage.setItem('token', rr.idToken)

    this.srv.loginWithToken()


  
  }).catch(error=>console.log("Error"))
  
   
  }


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

    let aaaa = JSON.parse(sessionStorage.getItem('urlParameters'))

    console.log("AAAA",aaaa)

    let bbb = sessionStorage.getItem('uniqueID')

    this.srv.db.collection('restaurants').doc(aaaa['restaurant_name']).collection(tmp_date).doc(bbb).set(this.form_.value).then((el1) => {

      console.log("response structure",el1)
    
      let txt_ = `Thank you for submitting your data.`
      // this.alreadySignedIn =true

      this.isSpinner = false
      this.form_.disable()

      this.openDialog(txt_)

      this.form_.reset()

    }).catch(error => {
      console.log('there was an error')
      this.isSpinner = false
    })

  }

}


