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

  isAdmin:boolean 
  isLogged: boolean
  

  ngOnInit(): void {

    this.srv.getCurrentValue.subscribe(el=>{

      this.isAdmin = el['isAdmin']
      this.isLogged = el['isLogged']
      console.log(this.isAdmin, this.isLogged)
    })

  }


  signOut(){

    console.log("sougned")

    // this.srv.signOut1 = true

    this.srv.isAdmin = false
    this.srv.isLogin = false

    sessionStorage.removeItem('token')
    sessionStorage.removeItem('customToken1')

    // sessionStorage.clear()
    // this.auth.isAdmin = false
    // this.auth.isLogin=false

  }

  ngOnDestroy(){
  
  }


}
