import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';

import { HavenDialogService } from '../../haven-dialog/service/haven-dialog.service';


@Component({
  selector: 'app-haven-login',
  templateUrl: './haven-login.component.html',
  styleUrls: ['./haven-login.component.css'],
})
export class HavenLoginComponent {

  email = '';
  password = '';
  messageText: string;

  constructor(private authService: AuthService, public dialogService: HavenDialogService) { }

  login() {
    this.authService.signinUser(this.email, this.password);
  }

  createAccount() {
    this.authService.createAccount(this.email, this.password).then(message => {
      if (message === 'Success') {
        this.authService.signinUser(this.email, this.password);
      } else {
        this.dialogService.openErrorDialog(message);
      }
    });
  }

}
