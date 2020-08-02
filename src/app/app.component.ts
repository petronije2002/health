import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'health';

  constructor(public srv: AuthService){}

  ngOnInit(){


    this.srv.checkIfLogged()

    
  }


  //   this.srv.auth.user.subscribe(usr=>{


  //     if(usr){usr.getIdToken().then(tok1=>{

  //       console.log(jwt_decode(tok1))
  //     })}

  //    })

  //   // sessionStorage.clear()
  // }
}
