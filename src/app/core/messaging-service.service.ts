import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { DataService } from './data-service.service';

@Injectable()
export class MessagingService {

  private messaging = firebase.messaging();

  private messageSource = new Subject();
  currentMessage = this.messageSource.asObservable();

  constructor(private dataService: DataService) { }

  // get permission to send messages
  getPermission(user) {
    this.messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return this.messaging.getToken();
      })
      .then(token => {
        console.log(token);
        this.dataService.saveToken(user, token);
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
  }

  // Listen for token refresh
  monitorRefresh(user) {
    this.messaging.onTokenRefresh(() => {
      this.messaging.getToken()
        .then(refreshedToken => {
          console.log('Token refreshed.');
          this.dataService.saveToken(user, refreshedToken);
        })
        .catch(err => console.log(err, 'Unable to retrieve new token'));
    });
  }

  // used to show message when app is open
  receiveMessages() {
    this.messaging.onMessage(payload => {
      console.log('Message received. ', payload);
      this.messageSource.next(payload);
    });
  }



}
