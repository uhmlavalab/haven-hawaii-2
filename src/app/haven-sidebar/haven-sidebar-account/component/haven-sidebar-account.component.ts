import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { NewPortfolioComponent } from '../../../haven-portfolio/components/new-portfolio/new-portfolio.component';
import { LoadedPortfolioService } from '../../../haven-portfolio/services/loaded-portfolio.service';


@Component({
  selector: 'app-haven-sidebar-account',
  templateUrl: './haven-sidebar-account.component.html',
  styleUrls: ['./haven-sidebar-account.component.css']
})
export class HavenSidebarAccountComponent {

  private portfoliosCollection: AngularFirestoreCollection<any>;
  portfolios: Observable<any[]>;
  selectedPortfolio: any;

  sessions = [
    { value: 'Session-0', viewValue: 'Session A' },
    { value: 'Session-1', viewValue: 'Session B' },
    { value: 'Session-2', viewValue: 'Session C' }
  ];

  newPortfolioData: any;

  constructor(public dialog: MatDialog, private afs: AngularFirestore, private afAuth: AngularFireAuth, private loadedPortfolio: LoadedPortfolioService) {
    this.portfoliosCollection = afs.collection<any>(`${afAuth.auth.currentUser.uid}`).doc('portfolios').collection('names');
    this.portfolios = this.portfoliosCollection.valueChanges();
   }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewPortfolioComponent, { width: '372px' });

    dialogRef.afterClosed().subscribe(result => {
      this.newPortfolioData = result;
    });
  }

  loadPortfolio() {
    this.loadedPortfolio.loadPortfolio(this.selectedPortfolio);
  }


}
