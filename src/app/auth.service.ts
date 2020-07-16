import { urlParameters, tokenRequest, event_ } from './models/models';
import { environment } from './../environments/environment';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { SocialAuthService } from 'angularx-social-login';
import { DeviceUUID } from './../../node_modules/device-uuid'

import * as jwt_decode from 'jwt-decode';
import { Router, ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})



export class AuthService implements OnInit {

  public logEmitter = new Subject<event_>()


  public isLogin: boolean =false
  role_ ='visitor'

  testIfToken :boolean = false

  public isAdmin: boolean = false

  isAlreadySigned: boolean = false
  tmp_id: string = ""

  signOut1 :boolean =false


  constructor(private route: ActivatedRoute,
    private hhtp: HttpClient,
    private authService: SocialAuthService
  ) { }


  requestToken(): Observable<string> {
    let tmp_params = JSON.parse(sessionStorage.getItem('urlParameters'))
    let tmp_token_req: tokenRequest = {
          uid: sessionStorage.getItem('uniqueID'),
          parameters: tmp_params,
          date: new Date().toDateString()
        }
    return this.hhtp.post<string>(environment.backendURL + '/returnToken', tmp_token_req)
  }


  ngOnInit() {}

  // signOut: Observable<boolean> = Observable.create((observer)=>{
  //   setInterval(() => {
  //     observer.next(this.signOut1)
  //   },1500)
  // })
  
  
  loginFromToken() :event_ {

    let tmp_ = sessionStorage.getItem('customToken1');

    let tmp_isAdmin : boolean 

    let tmp_isLogin: boolean


    try{
      var decoded = jwt_decode(tmp_);
      this.role_ = decoded['claims']['role']

      if (this.role_=='admin'){
        tmp_isAdmin=true
      }else{
        tmp_isAdmin = false
      }
      let tmp_now1 =  (new Date().getTime() / 1000).toFixed(0)
      if ((Number(tmp_now1),Number(decoded['exp'])-Number(tmp_now1))>0){
        tmp_isLogin = true
      }else{
        tmp_isLogin = false
      }
    }catch{

      console.log("there was an error in observable")
       this.role_ = 'visitor'
       tmp_isLogin = false
    }




    let ee :event_ = {
      isAdmin: tmp_isAdmin,
      isLogged: tmp_isLogin
    }

    this.isAdmin = tmp_isAdmin
    this.isLogin = tmp_isLogin

    return ee

  }

  // getLogin: Observable<any> = Observable.create((observer) => {
  //   setInterval(() => {


    
  //     let tmp_ = sessionStorage.getItem('customToken1');

  //     try{
  //       var decoded = jwt_decode(tmp_);
  //       this.role_ = decoded['claims']['role']

  //       if (this.role_=='admin'){
  //         this.isAdmin=true
  //       }else{
  //         this.isAdmin = false
  //       }
  //       let tmp_now1 =  (new Date().getTime() / 1000).toFixed(0)
  //       if ((Number(tmp_now1),Number(decoded['exp'])-Number(tmp_now1))>0){
  //         this.isLogin = true
  //       }else{
  //         this.isLogin = false
  //       }
  //     }catch{
  //       console.log("there was an error in observable")
  //        this.role_ = 'visitor'
  //        this.isLogin = false
  //     }

  //     observer.next({'isLogged': this.isLogin, 'role':this.role_,'isAdmin': this.isAdmin})

  //   }, 1500)
  // })



  getCurrentValue: Observable<any> = Observable.create((observer) => {
    setInterval(() => {
    
      observer.next({'isLogged': this.isLogin, 'role':this.role_,'isAdmin': this.isAdmin})

    }, 1500)
  })
}




