import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase';
import { MyFireService } from '../shared/myfire.service';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit, OnDestroy {
  personalPostsRef: any;
  postLists: any = [];

  constructor(private myFire: MyFireService, private notificationService: NotificationService) { }

  ngOnInit() {

    const uid = firebase.auth().currentUser.uid;
    this.personalPostsRef = this.myFire.getUserPostsRef(uid);
    this.personalPostsRef.on('child_added', data => {
      this.postLists.push({
        key: data.key,
        data: data.val()
      })
    }); 
  }

  onFileSelection(event){
    const fileList: FileList = event.target.files;

    if(fileList.length > 0){
      const file: File = fileList[0];
      this.myFire.uploadFile(file)
        .then(data => {
          this.notificationService.display('success', 'Picture Successfully uploaded!!');
          this.myFire.handleImageUpload(data);
        })
        .catch(err => {
          this.notificationService.display('error', err.message);
        });
    }

  } 

  ngOnDestroy(){
    this.personalPostsRef.off();
  }
}
