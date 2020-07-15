import { environment } from './../environments/environment';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SocialAuthService } from 'angularx-social-login';

import * as jwt_decode from 'jwt-decode';


export interface token_request {

  uid: string
  parameters: Object
  date: string
}

export interface Token {

  token: string
}


@Injectable({
  providedIn: 'root'
})


export class AuthService implements OnInit {


  isLogin: boolean = false

  role_



  isAdmin: boolean = false

  constructor(
    private hhtp: HttpClient,
    private authService: SocialAuthService
  ) { }


  requestToken(uuid: token_request): Observable<string> {
    return this.hhtp.post<string>(environment.backendURL + '/returnToken', uuid)
  }

  ngOnInit() { }

  getLogin: Observable<boolean> = Observable.create((observer) => {
    setInterval(() => {

      let tmp_ = sessionStorage.getItem('customToken1');

      try{
        var decoded = jwt_decode(tmp_);
        // var role = decoded['claims']['role']

        this.role_ = decoded['claims']['role']
        let tmp_now1 =  (new Date().getTime() / 1000).toFixed(0)

        if ((Number(tmp_now1),Number(decoded['exp'])-Number(tmp_now1))>0){
          this.isLogin = true

          
        }else{
          this.isLogin = false
        }

        


        
      }catch{

        console.log("there was an error in observable")


         this.role_ = 'visitor'

         this.isLogin = false
      }

      observer.next({'isLogged': this.isLogin, 'role':this.role_})


      // try{

        
        
      //   let tmp_now = new Date().toUTCString()
      //   let tmp_now1 =  (new Date().getTime() / 1000).toFixed(0)
      //   // console.log("UTC",Number(decoded['exp']),  Number(tmp_now1),Number(decoded['exp']) -Number(tmp_now1) )

      //   if ((Number(tmp_now1),Number(decoded['exp'])-Number(tmp_now1))>0){
      //     this.isLogin = true

          
      //   }else{
      //     this.isLogin = false
      //   }
      // }
      // catch{

      //   console.log("there was an error in observable")

      // }

      // observer.next({'isLogged': this.isLogin, 'role':role})

    }, 2000)
  })
}




