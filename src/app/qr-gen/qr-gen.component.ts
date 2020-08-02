import { environment } from './../../environments/environment';
import { AuthService } from './../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr-gen',
  templateUrl: './qr-gen.component.html',
  styleUrls: ['./qr-gen.component.css']
})
export class QrGenComponent implements OnInit {

  

  constructor(public srv: AuthService) { }



  urlData :string
  fileUrl
  rest_name: string= "no name"

  dataURL

  showCode: boolean = false

  ngOnInit(): void {

    console.log('rastName',sessionStorage.getItem('restaurantName'))

    setTimeout(()=>{
        this.form_.patchValue({'restaurant_name': sessionStorage.getItem('restaurantName')})
    },2000
    ) 
  }


  form_: FormGroup = new FormGroup({
    table_number: new FormControl(null,[Validators.required, Validators.max(999)]),
    restaurant_name: new FormControl(null),
    size_: new FormControl(null,Validators.required)})

  generateQR(){

    this.urlData = sessionStorage.getItem('regDomain') + '/registration?' 

    this.urlData = this.urlData + `restaurantName=${sessionStorage.getItem('restaurantName')}&` + `restaurantID=${sessionStorage.getItem('restaurantID')}&` + `tableNumber=${this.form_.value['table_number']}`
    console.log(this.form_.value)

    this.showCode = true
    console.log("URL DATA for QRCODE", this.urlData)

  }

  resetForm(){
    this.form_.reset()

    this.showCode=false
  }

  downloadQrCode(){

    let c = document.getElementsByClassName("qrcode");
    let d = document.getElementsByTagName('canvas')

    

    // var dataURL = d[0].toDataURL('image/png')

    var imgData = d[0].toDataURL()
    console.log("DATA", imgData)

    var a = document.createElement("a"); //Create <a>
    a.href = imgData //Image Base64 Goes here
    a.download = "QRCode+" + `${this.urlData}` + ".png"; //File name Here
    a.click()
    // // c.namedItem('canvas')[0]

    // console.log("CANVAS",d, imgData)


    // dataURL.

    

    

    // var blob = new Blob([imgData], { type: 'image/png' });
    // var url= window.URL.createObjectURL(blob);
    // console.log(url)
    // window.open(url);
  }

}
