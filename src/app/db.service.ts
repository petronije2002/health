import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { DeviceUUID } from './../../node_modules/device-uuid'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import {urlParameters,tokenRequest, event_} from './models/models'
import { SocialAuthService } from 'angularx-social-login';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database'

@Injectable({
  providedIn: 'root'
})
export class DBService implements OnInit {

  usersRef: AngularFireList<any>;      // Reference to users list, Its an Observable
  userRef: AngularFireObject<any>;     // Reference to user object, Its an Observable too

  

  constructor(
    
     private db: AngularFireDatabase,
      private auth: AngularFireAuth,
     
  ) { }



  ngOnInit(){


    // this.auth.signInWithCustomToken(sessionStorage.getItem('customToken1')).then(el=>{
    //   console.log("The user logged", el)
    // })
  }


  loginToFirebase(){

    let tmp_ = sessionStorage.getItem('customToken1')
    this.auth.signInWithCustomToken(tmp_).then(el=>{
    console.log('Logged in', el)
    }).catch(error=>{

     
    })
  }


  getApplicationList() {

    let tmp_date= new Date().toDateString()

    let tmp_list = `restaurants/bukowsky/${tmp_date}`

    this.usersRef = this.db.list(tmp_list);
    
    return this.usersRef;
  }  
   

}
