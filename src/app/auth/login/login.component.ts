import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';

import { NotificationService } from 'src/app/shared/notification.service';
import { MyFireService } from 'src/app/shared/myfire.service';
import { UserService } from 'src/app/shared/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private myFireService: MyFireService,
    private userService: UserService
    ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm){
    const email = form.value.email;
    const password = form.value.password;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(userData => {
        if(userData.user.emailVerified){
          return this.myFireService.getUserFromDatabase(userData.user.uid);
        } else {
          const message = 'Your email is not yet verified';
          this.notificationService.display('error', message);
          firebase.auth().signOut();
        }
      })
      .then(userDataFromDatabase => {
        if(userDataFromDatabase){
          this.userService.set(userDataFromDatabase);
          this.router.navigate(['/allposts']);
        }
      })
      .catch(error => {
        this.notificationService.display('error', error.message);
      })
    
  }
}
