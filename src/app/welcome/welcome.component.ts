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
import {urlParameters,tokenRequest} from './../models/models'
import { Subscription } from 'rxjs';


export interface alreadySigned {
  name_: string,
  phone_: string,
  email?: string
}


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
      ) { }


  ngOnInit(): void {


    this.srv.getLogin.subscribe((el)=>{
      next:  this.isLogged= el['isLogged'];

      console.log(el)

      if (el['role']==='admin'){
        this.isAdmin = true
      }else{
        this.isAdmin = false
      }
  
    })

    // First check uuid, based on device/browser , for anonimous acccess

    let tmp_check = sessionStorage.getItem('uniqueID')

    if (tmp_check !== null) {
      this.tmp_id = sessionStorage.getItem('uniqueID')
    } else {
      this.tmp_id = new DeviceUUID().get()
      sessionStorage.setItem('uniqueID', this.tmp_id)
    }
    

    this.form_.setValue({'name_': null,"phone_":null,"email_":null})

    this.route.queryParams.subscribe((el:urlParameters) => {

      // Check if there are some parameters gotten from qr code

      if (Object.keys(el).length==3){
        this.parameters = el
        console.log('URL 123parameters', this.parameters)



        let tmp_token_req: tokenRequest = {

          uid: this.tmp_id,
          parameters: this.parameters,

          date: new Date().toDateString()

        }


        this.customTokenSubscription = this.srv.requestToken(tmp_token_req).subscribe(customToken=>{
          sessionStorage.setItem('customToken1',customToken['token'] )
        })

      }else{

        console.log("Please scan the QR CODE")
      }
      
      })

    

    



    // this.username = ""

    // this.authService.authState.subscribe((user_)=>{

    //   this.user = user_

    //   this.username = this.user.name
    // })

    // let test_ = new DeviceUUID().get()
    // var du = new DeviceUUID().parse();
    // let tmp_check = sessionStorage.getItem('uniqueID')

    // if (tmp_check !== null) {
    //   this.tmp_id = sessionStorage.getItem('uniqueID')
    // } else {
    //   this.tmp_id = new DeviceUUID().get()
    //   localStorage.setItem('uniqueID', this.tmp_id)
    // }
    // let tmp_Date = new Date().toDateString()

    this.route.queryParams.subscribe((el:urlParameters) => {
      this.parameters = el
      console.log('url parameters', this.parameters)

      console.log(this.parameters)
      if (Object.keys(this.parameters).length <3) {
        console.log('Please scan the code again')
      } else {
        setTimeout(()=>{
          this.srv.requestToken({ 'uid': this.tmp_id, 'parameters': this.parameters, 'date': new Date().toDateString() }).subscribe(el1 => {

          this.token_ = el1['token']
          console.log("Custom token", el1['token'])

          sessionStorage.setItem('customToken1',this.token_)

          
          
          this.auth.signInWithCustomToken(el1['token']).then(el2=>{
          

          this.db.collection('restaurants').doc('bukowsky').collection(new Date().toDateString()).doc(this.tmp_id).snapshotChanges().subscribe(el3=>{

            console.log('complete', el3)

            

            
            console.log('current document: ', el3.payload.data())

            let current_doc = el3.payload.data()
            
            if(typeof current_doc !=='undefined'){
              this.alreadySignedIn =true
              this.alreadySignedInData = current_doc
            }

          })




      }).catch(error=>{
        console.log(error)
      })




        })
      },1000)
      }
    })

  }

  
  signInWithGoogle() {


    const googleLoginOptions =  {
      scope: 'profile email'
    }; 

    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((rr)=>{console.log("RESULT", rr);

    this.form_.patchValue({'name_': rr.name});
    this.form_.patchValue({'email_': rr.email});

    this.readonly_=true

    sessionStorage.setItem('token', rr.idToken)

    // this.token_=rr.idToken

    this.srv.requestToken({ 'uid': this.tmp_id, 'parameters': this.parameters, 'date': new Date().toDateString() }).subscribe((rr1)=>{

      console.log("QQQQQQQQQQQQ", rr1['token'])

      sessionStorage.setItem('customToken1', rr1['token'])

      this.auth.signInWithCustomToken(rr1['token']).then(el2=>{

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



  submitForm() {

    this.srv.requestToken({ 'uid': this.tmp_id, 'parameters': this.parameters, 'date': new Date().toDateString() }).subscribe(el => {

      console.log('ReturnedToken', el['token'])



      this.token_ = el['token']


      this.auth.signInWithCustomToken(el['token']).then(el => {

        console.log("Loging result", el)
        let tmp_date = new Date().toDateString()
        console.log("Loging result", this.parameters)

        this.db.collection('restaurants').doc(this.parameters['restaurant_name']).collection(tmp_date).doc(this.tmp_id).set(this.form_.value).then((el1) => {

          console.log("DB result", el1)
          this.alreadySignedIn = true





          this.form_.reset()

          console.log("PARAMTERS!!!",this.parameters)

         this.router.navigateByUrl('/')




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


