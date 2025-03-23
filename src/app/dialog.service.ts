import { Injectable } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DialogComponent} from "./dialog/DialogComponent";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {PortfolioListModel} from "./models/portfolioListModel";
import {BuyDialogComponent} from "./dialog/BuyDialogComponent";
import {SellDialogComponent} from "./dialog/SellDialogComponent";
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) { }

  openDialog(source: string, datetime: string, headline: string, summary: string, url: string) {
    const dialogConfig = new MatDialogConfig();
v
    dialogConfig.position = {
      'top': '0',
      'left': '0',
      'right': '0',
      'bottom': '0'
    };
    dialogConfig.data = {
      source: source,
      datetime: datetime,
      headline: headline,
      summary: summary,
      url: url
    };
    this.dialog.open(DialogComponent, dialogConfig);
  }

  openBuyDialog(portfolioListModel: PortfolioListModel) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      portfolioListModel: portfolioListModel
    }

    this.dialog.open(BuyDialogComponent, dialogConfig);
  }

  openSellDialog(portfolioListModel: PortfolioListModel) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      portfolioListModel: portfolioListModel
    }

    this.dialog.open(SellDialogComponent, dialogConfig);
  }
}
