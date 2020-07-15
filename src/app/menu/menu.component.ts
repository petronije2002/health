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

  nubmerOfCartItems : number

  positionBadge: MatBadgePosition
  sizeBadge: MatBadgeSize

  numberOfWishListItems: number

  cartSubscriber : Subscription

  wishListSubscription : Subscription

  constructor(public router: Router) { }

  ngOnInit(): void {

  }

  ngOnDestroy(){

    

  }


}
