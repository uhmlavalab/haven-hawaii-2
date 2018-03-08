import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthService {

  private token: string = null;

  constructor(private router: Router, private afAuth: AngularFireAuth) { }

  signinUser(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(response => {
      firebase.auth().currentUser.getIdToken().then((token: string) => {
        this.token = token;
        if (this.token) {
          this.router.navigate(['/home']);
        }
      });
    }, error => alert(error.message)).catch(error => alert(error));
  }

  signOut(): void {
    this.afAuth.auth.signOut();
    this.token = null;
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return this.token != null;
  }

  createAccount(email, password): Promise<string> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(user => {
      if (user !== null) {
        return Promise.resolve('Success');
      }
    }, error => {
      return Promise.resolve(error.message);
    });
  }
}
