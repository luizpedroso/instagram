import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit(){
    const firebaseConfig = {
      apiKey: "AIzaSyAq67txIt1HyEfYoP1zAQuFzqBD7sdzN-M",
      authDomain: "instragram-d0212.firebaseapp.com",
      databaseURL: "https://instragram-d0212.firebaseio.com",
      projectId: "instragram-d0212",
      storageBucket: "instragram-d0212.appspot.com",
      messagingSenderId: "813682108921",
      appId: "1:813682108921:web:e2fafc8218c3eadb4bb528"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
}
