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
// import {SocialUser ,SocialAuthService, GoogleLoginProvider } from "angularx-social-login";
import {urlParameters,tokenRequest, event_} from './../models/models'
import { Subscription } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})

export class WelcomeComponent implements OnInit {

  imageUrl:string = ''

  

  parameters: urlParameters = {
    restaurant_id : "",
    table_number: "",
    restaurant_name:""
  }

  
  

  
  constructor(
      private route: ActivatedRoute,
      public router: Router,
       public srv: AuthService, 
      
      private dialog: MatDialog
      ) { }

  
  ngOnInit(): void {


    this.srv.urlDownload.subscribe(link_ => {
      this.imageUrl = link_

     console.log("IMAGE URL",this.imageUrl)
    })


    this.srv.downloadFile()


    





    


    
  
  }

  


  resetForm(){

  }


  


  
}


