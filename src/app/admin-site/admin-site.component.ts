import { DBService } from './../db.service';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-admin-site',
  templateUrl: './admin-site.component.html',
  styleUrls: ['./admin-site.component.css']
})
export class AdminSiteComponent implements OnInit {
  custom_token:string

  isAdmin: boolean
  isLogged: boolean

  results = []

  applications_

  token_id
  token_refresh

  current_user_

  constructor(public srv: AuthService, private auth: AngularFireAuth,public db: AngularFirestore) { }

  ngOnInit(): void {

    this.srv.logEmitter.subscribe(ev=>{
      this.isAdmin = ev.isAdmin
      this.isLogged = ev.isLogged
    }
  )
    
  }

  signOut(){

    this.srv.logEmitter.unsubscribe()

    this.srv.signOut()

  }



  

  //   this.custom_token = sessionStorage.getItem('customToken1')

  //   this.srv.logEmitter.subscribe(ev => {

  //     this.isAdmin = ev.isAdmin
  //     this.isLogged = ev.isLogged

  //     if (this.isLogged == false) {
  //       sessionStorage.clear()


  //     }
  //   })


  //   console.log("isAdmin","idLogged", this.isAdmin,this.isLogged)

  //   console.log(this.custom_token)

  //   this.auth.signInWithCustomToken(this.custom_token).then(el => {

  //     console.log(el)
  //     this.db.collection('restaurants').doc(JSON.parse(sessionStorage.getItem('urlParameters'))['restaurant_name']).collection(new Date().toDateString()).valueChanges().subscribe(doc_ => {
  //       console.log("RESULTS", doc_)
  //       this.results = doc_
  //     })
  //   })
  // }



  

}
