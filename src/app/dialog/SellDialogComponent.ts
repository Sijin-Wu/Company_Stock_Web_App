import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PortfolioListModel} from "../models/portfolioListModel";
import {MongoDbService} from "../mongodb.service";
import {BalanceModel} from "../models/balanceModel";
import {NgIf} from "@angular/common";
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-dialog-sell',
  standalone: true,
  imports: [
    NgIf
  ],
  template: `
    <h1 mat-dialog-title>{{ this.portfolioListModel.ticker }}</h1>
    <div class="info">
      <p>Current price: {{ this.portfolioListModel.currentPrice }}</p>
      <p>Money in Wallet: {{ this.currentBalance }}</p>
    </div>
    <div class="input-group">
      <label for="quantity">Quantity:</label>
      <input type="text" #quantity (input)="onInputChange(quantity.value)">
      <p *ngIf="notEnoughShares" style="color: red;">You can not sell the stocks that you don't have</p>
    </div>
    <p>Total: {{ this.newCost.toFixed(2) }}</p>
    <button style="background: green;
    border: none;
    color: white;
    font-size: 20px;
    margin-left: 150px;
    cursor: pointer; " mat-button mat-dialog-close (click)="sellStock()">Sell</button>

  `
})
export class SellDialogComponent {
  protected portfolioListModel: PortfolioListModel;
  protected notEnoughShares = false;
  protected newQuantity: string = '';
  protected newAvg: string = '';
  protected currentPrice: string = '';
  protected totalCost: number = 0.0;
  protected currentBalance: number = 0.0;
  protected newCost: number = 0.0;

  constructor(public dialogRef: MatDialogRef<SellDialogComponent>,private alertService: AlertService,
              private mongoDbService: MongoDbService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.portfolioListModel = data.portfolioListModel;
    this.mongoDbService.getBalance().then(res => {
      this.currentBalance = parseFloat(res.currentBalance);
    });
  }

  sellStock() {
    if (parseInt(this.newQuantity) < 0 || this.newQuantity === '' || parseInt(this.newQuantity) < 0) {
      return;
    }

    const newPortFolioModel = new PortfolioListModel(
      this.portfolioListModel.ticker,
      this.portfolioListModel.name,
      this.newAvg,
      this.newQuantity,
      this.currentPrice
    );

    // console.log("new model:  " + JSON.stringify(newPortFolioModel));
    // console.log("currentBalance:  " + this.currentBalance.toString());
    // console.log("totoalCost:  " + this.totalCost.toString());

    const newBalance = this.currentBalance + this.newCost;
    const newBalanceModel = new BalanceModel('balance', newBalance.toFixed(2));

    // console.log("new balance:  " + JSON.stringify(newBalanceModel));
    this.mongoDbService.updateTradeItem(newPortFolioModel);
    this.mongoDbService.updateBalance(newBalanceModel);

    this.dialogRef.close();
    this.alertService.showAlert(`${this.portfolioListModel.ticker} sold successfully`);
  }

  onInputChange(qBuy: string) {
    if (qBuy === '') {
      return;
    }



    const quantity = parseInt(qBuy);

    // console.log("but q: " + qBuy);


    this.mongoDbService.getTradeItem(this.portfolioListModel.ticker).then( res => {
      if (res.status === 404) {
        this.notEnoughShares = true;
        return;
      }
      else {



        // console.log("tade item already exists: " + JSON.stringify(res))

        const oldAvgCost = parseFloat(res.avgCost);
        const oldShares = parseInt(res.shares, 10);

        if (quantity > parseInt(res.shares)) {
          this.notEnoughShares = true;
          return;
        }

        const currentPrice = parseFloat(this.portfolioListModel.currentPrice)

        const newShares = oldShares - quantity;

        const totalCost = oldAvgCost * oldShares - currentPrice * quantity;
        const newAvgCost = totalCost / newShares;

        const newCost = currentPrice * quantity;

        this.mongoDbService.getBalance().then(res => {
          let balance = parseFloat(res.currentBalance);
          // console.log("balance: " + balance)

          this.currentPrice = currentPrice.toString();
          this.newAvg = newAvgCost.toString();
          this.newQuantity = newShares.toString();
          this.totalCost = totalCost;
          this.currentBalance = balance;
          this.newCost = newCost

        });
      }
    });
  }
}
