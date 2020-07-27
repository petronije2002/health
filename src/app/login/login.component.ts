import { AuthService } from './../auth.service';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }



export class LoginComponent implements OnInit {

  resetPassword: boolean = false



  constructor(public srv: AuthService, private router: Router) { }

  form_ : FormGroup = new FormGroup({

    username: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl(null, Validators.required)
  })

  ngOnInit(): void {
  }

  submitForm(){

    this.srv.receiveCustomTokenFromUsernamePassowrd(this.form_.value['username'],this.form_.value['password']).subscribe(customToken=>{

      console.log("CustomToken",customToken);

      

      
      this.srv.loginWithCustomToken(customToken['token'])

      this.router.navigate(['/home'])

    },error=>{console.log("there was an error",error); this.resetPassword=true; this.form_.disable()})
 
  }

  resetForm(){
    this.form_.reset()

  }



  resetPasswordFunction(){
    this.resetPassword=false

    this.router.navigateByUrl('/reset')
  }

  tryAgain(){

    this.resetPassword= false
    this.form_.enable()

    this.form_.reset()
  }

  // matcher = new MyErrorStateMatcher();

}
