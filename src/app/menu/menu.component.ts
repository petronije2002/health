import { event_ } from './../models/models';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
// import {  CartOperatorService } from './../../services/cart-operator.service'
import { Subscription } from 'rxjs';
import { MatBadgePosition,MatBadgeSize } from '@angular/material/badge';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit , OnDestroy{

  
  constructor(public router: Router, public srv: AuthService) { }

  isAdmin:boolean = false
  isLogged: boolean = false
  userName: string = 'visitor'
  initials: string 

  // initials = this.userName.split(" ").map((n)=>n[0]).join(".")

  restaurantName: string = ''

  event_ : event_ 
  

  ngOnInit(): void {

    this.srv.logEmitter.subscribe(ev=>{

      this.isAdmin = ev.isAdmin,
      this.isLogged = ev.isLogged

      this.userName = ev.userName

      this.initials = this.userName.split(" ").map((n)=>n[0]).join(".")

      this.restaurantName= ev.restaurantName

      if(ev.isSignedOut===true){

      }
    
    })


  }


  signOut(){
    
    this.srv.isAdmin = false
    this.srv.isLogged = false
    this.srv.isSignedOut = true
    this.srv.emitCurrentLogin()

    this.srv.auth.signOut().then(er=>{
      sessionStorage.clear()
      this.router.navigateByUrl('/home').then(el=>{
      
      

      })

      

      // this.srv.auth.signOut().then(rr=>
      //   this.srv.logEmitter.unsubscribe()
      // )


  
  })
}

  ngOnDestroy(){
  }


}
