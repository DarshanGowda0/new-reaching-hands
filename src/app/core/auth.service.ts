import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { User } from './user';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
@Injectable()
export class AuthService {

  user: Observable<User>;
  authUser;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.authUser = this.afAuth.authState;
    this.user = this.afAuth.authState.switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return Observable.of(null);
      }
    });
    this.afAuth.auth.getRedirectResult()
      .then((credential) => {
        console.log('something ', credential);
        this.updateUserData(credential.user);
        console.log('here');
        this.router.navigate(['']);
      }).catch(err => {
        console.error(err);
      });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {


    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
        this.router.navigate(['']);
      });

  }

  signOut() {
    this.afAuth.auth.signOut();
    this.router.navigate(['login']);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      // checkAdmin: user.checkAdmin,
      //checkEditor: user.checkEditor
    };
    return userRef.set(data, { merge: true });
  }

  canRead(user: User): boolean {
    const allowed = ['admin', 'editor'];
    return user.checkAdmin || user.checkEditor;
  }

  canEdit(user: User): boolean {
    const allowed = ['admin'];
    return user.checkAdmin;
  }

  canDelete(user: User): boolean {
    const allowed = ['admin'];
    return user.checkAdmin;
  }

  isAuthorized(user: User): boolean {
    const isAllowed = ['admin', 'editor'];
    return user.checkAdmin || user.checkEditor;
  }

  canAccess(user: User): boolean {
    const allowed = ['admin'];
    return user.checkAdmin;
  }

}
