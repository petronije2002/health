import { DialogComponent } from './../dialog/dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
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


// export interface alreadySigned {
//   name_: string,
//   phone_: string,
//   email?: string
// }


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})




export class WelcomeComponent implements OnInit {

  customTokenSubscription: Subscription 
  loggedWithGoogle: boolean = false

  isAdmin: boolean = false
  isLogged: boolean = false
  readonly_ = false

  parameters: urlParameters = {
    restaurant_id : "",
    table_number: "",
    restaurant_name:""
  }

  alreadySignedIn: boolean = false

  alreadySignedInData 
  token_
  tmp_id



  form_: FormGroup = new FormGroup({
    name_: new FormControl(null, Validators.required),
    phone_: new FormControl(null, Validators.required),
    email_: new FormControl(null)

  })

  user: SocialUser 
  username = ""

  constructor(private route: ActivatedRoute, public router: Router,
     private srv: AuthService, 
     private db: AngularFirestore,
      private auth: AngularFireAuth,
      private authService: SocialAuthService,
      private http: HttpClient,
      private dialog: MatDialog
      ) { }


  ngOnInit(): void {

    this.srv.logEmitter.subscribe(ev=>{

      this.isAdmin = ev.isAdmin
      this.isLogged = ev.isLogged

      if(this.isLogged==false){
        sessionStorage.clear()
        this.form_.reset()
        this.form_.disable()
        
      }
    })


    let tmp_check = sessionStorage.getItem('uniqueID')

    if (tmp_check !== null) {
      this.tmp_id = sessionStorage.getItem('uniqueID')
    } else {
      this.tmp_id = new DeviceUUID().get()
      sessionStorage.setItem('uniqueID', this.tmp_id)
    }

    this.form_.setValue({'name_': null,"phone_":null,"email_":null})

    this.route.queryParams.subscribe((el:urlParameters) => {


      console.log("url parameters", el)

      // Check if there are some parameters gotten from qr code

      if (Object.keys(el).length==3){

        let aaaa = JSON.stringify(el)
        sessionStorage.setItem('urlParameters', aaaa)
        setTimeout(()=>{},500) 
  
        this.customTokenSubscription = this.srv.requestToken().subscribe(customToken=>{
          sessionStorage.setItem('customToken1',customToken['token'] )

          this.srv.loginFromToken()

          this.auth.signInWithCustomToken(customToken['token']).then(el2=>{
            this.srv.isLogin = true
            this.srv.emitCurrentLogin()

            // test if there is already an document

           this.db.collection('restaurants').doc(JSON.parse(sessionStorage.getItem('urlParameters'))['restaurant_name']).collection(new Date().toDateString()).doc(this.tmp_id).get().subscribe(doc_=>{

            console.log("retrieved document",doc_.data())

            let name_ =  doc_.data()['name_']

            let txt_ = `You have already sent your data. Thank you, ${name_}`
            // this.alreadySignedIn =true
            this.form_.disable()

            this.openDialog(txt_)

           },error=>{console.log(error)})

          }).catch(error=>console.log("Error with login to database"))
    
        
        })
      
      
      }
    

         
      else{

        sessionStorage.setItem('urlParameters', '')
        console.log("Please scan the QR CODE")
      }
      
      })

  
    

  }

  // signOut(){

  //   console.log("soignedout from welcome")
  //   sessionStorage.removeItem('token')
  //   this.form_.reset()

  //   this.isAdmin = false
  //   this.isLogged = true
  //   this.srv.isAdmin=false

  //   this.srv.isLogin = true

  // }

  
  signInWithGoogle() {

    const googleLoginOptions =  {
      scope: 'profile email'
    }; 

    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((rr)=>{console.log("RESULT", rr);

    this.form_.patchValue({'name_': rr.name});
    this.form_.patchValue({'email_': rr.email});

    this.readonly_=true

    this.srv.isAdmin=true
    this.srv.isLogin = true
    
    this.srv.emitCurrentLogin()

    console.log("GOOGLE TOKEN", rr)


    sessionStorage.setItem('token', rr.idToken)

    // this.token_=rr.idToken

    this.srv.requestToken().subscribe((rr1)=>{
      //{ 'uid': this.tmp_id, 'parameters': this.parameters, 'date': new Date().toDateString() }

      sessionStorage.setItem('customToken1', rr1['token'])

      this.auth.signInWithCustomToken(rr1['token']).then(el2=>{

        // this.srv.isAdmin=true

        // this.srv.isLogin = true
        // this.isAdmin = true

        this.srv.loginFromToken()


        console.log('Logged in', el2)

        console.log("CUSTOM TOKEN", rr1['token'])
      })

    
    })
  
  
  }).catch(error=>console.log("Error"))
  
   
  }


  resetForm(){

    this.form_.reset()
      this.form_.get('phone_').updateValueAndValidity()
  }


  openDialog(text_?:string) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: text_
  };

    this.dialog.open(DialogComponent, dialogConfig);
}



  submitForm() {

    this.srv.requestToken().subscribe(el => {
      this.token_ = el['token']
      this.auth.signInWithCustomToken(el['token']).then(el1 => {
        let tmp_date = new Date().toDateString()
  
        this.db.collection('restaurants').doc(JSON.parse(sessionStorage.getItem('urlParameters'))['restaurant_name']).collection(tmp_date).doc(this.tmp_id).set(this.form_.value).then((el1) => {
          this.alreadySignedIn = true
          this.form_.reset()

        }).catch(error => {
          console.log('there was an error')
        })



      }).catch(error => {

        console.log("ERROR IS:", error)
      }
      )




    })

    console.log(this.form_.value)

    console.log(new Date().toDateString())

  }



  // getBrowserName() {
  //   const agent = window.navigator.userAgent.toLowerCase()
  //   switch (true) {
  //     case agent.indexOf('edge') > -1:
  //       return 'edge';
  //     case agent.indexOf('opr') > -1 && !!(<any>window).opr:
  //       return 'opera';
  //     case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
  //       return 'chrome';
  //     case agent.indexOf('trident') > -1:
  //       return 'ie';
  //     case agent.indexOf('firefox') > -1:
  //       return 'firefox';
  //     case agent.indexOf('safari') > -1:
  //       return 'safari';
  //     default:
  //       return 'other';
  //   }
  // }


}


