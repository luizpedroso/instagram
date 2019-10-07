import * as firebase from 'firebase';
import { UserService } from './user.service';

export class MyFireService {

    constructor(private user: UserService){}

    getUserFromDatabase(uid){
        const ref = firebase.database().ref('users/' + uid);
        return ref.once('value')
            .then(snapshot => snapshot.val());
    }

    generateRandomName(){
        let text = "";
        const possible = "ABCDEFGHJIKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    uploadFile(file) {
        const fileName = this.generateRandomName();
        const fileRef = firebase.storage().ref().child('image/' + fileName);
        const uploadTask = fileRef.put(file);

        return new Promise((resolve, reject) => {

            uploadTask.on('state_changed', snapshot => {
            }, error => {
                reject(error);
            }, () => {
                fileRef.getDownloadURL().then(fileUrl => {
                    resolve({fileName, fileUrl});
                });     
            });
            
        });
    }

    handleImageUpload(data){
        const user = this.user.getProfile();

        const newPersonalPostKey = firebase.database().ref().child('myposts').push().key;
        const personalPostDetails = {
            fireUrl: data.fileUrl,
            name: data.fileName,
            creationDate: new Date().toString()
        };

        const allPostKey = firebase.database().ref().child('allposts').push().key;
        const allPostDetails = {
            fireUrl: data.fileUrl,
            name: data.fileName,
            creationDate: new Date().toString(),
            uploadedBy : user
        };

        const imageDetails = {
            fileUrl: data.fileUrl,
            name: data.fileName,
            creationDate: new Date().toString(),
            uploadedBy : user,
            favoriteCount: 0
        };

        const updates = {};
        updates['/myposts/' + user.uid + "/" + newPersonalPostKey] = personalPostDetails;
        updates['/allposts/' + allPostKey] = allPostDetails;
        updates['/images/' + data.fileName] = imageDetails;
        return firebase.database().ref().update(updates);
    }

    getUserPostsRef(uid){
        return firebase.database().ref('myposts').child(uid);
    }

    handleFavoriteClicked(imageData){
        const uid = firebase.auth().currentUser.uid;

        const updates = {};

        updates['/images/' + imageData.name + "/oldFavoriteCount"] = imageData.favoriteCount;
        updates['/images/' +  imageData.name + "/favoriteCount"] = imageData.favoriteCount + 1;
        updates['/favorites/' + uid + "/" + imageData.name] = imageData;

        return firebase.database().ref().update(updates);
    }

    followUser(uploadedByUser){
        const uid = firebase.auth().currentUser.uid;

        const updates = {};

        updates['/follow/' + uid + "/" + uploadedByUser.uid] = true;

        return firebase.database().ref().update(updates);
    }
    
}