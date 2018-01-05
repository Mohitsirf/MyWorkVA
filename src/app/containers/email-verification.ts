import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'va-email-verify-page',
  template: `
    <va-img-layout>
      <div fxLayout="column" fxLayoutAlign="center center" fxLayoutGap="40px">
        <span style="font-size: 20px" >Thank you for verifying your Email Address.</span>

       <div fxLayout="column" fxLayoutAlign="center center">
         <span>Please complete your Profile</span>
         
         <mat-form-field>
           <input matInput placeholder="Your Name">
         </mat-form-field>
         
         <mat-form-field>
           <input matInput placeholder="password">
         </mat-form-field>
         
         <mat-form-field>
           <input matInput placeholder="Confirm password">
         </mat-form-field>
         
         <button mat-raised-button color="ascent">Save</button>
       </div>


      </div>
    </va-img-layout>
  `,
  styles: []
})
export class EmailVerificationComponent implements OnInit {
  ngOnInit() {
  }

}
