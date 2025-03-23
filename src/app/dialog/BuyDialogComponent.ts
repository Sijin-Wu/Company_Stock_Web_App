import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MongoDbService} from "../mongodb.service";
import {PortfolioListModel} from "../models/portfolioListModel";
import {CommonModule} from "@angular/common";
import {BalanceModel} from "../models/balanceModel";
import { AlertService } from '../alert.service';
@Component({
  selector: 'app-dialog-buy',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  template: `
    <h1 mat-dialog-title>{{ this.portfolioListModel.ticker }}</h1>
    <div class="info">
      <p>Current price: {{this.portfolioListModel.currentPrice}}</p>
       <p>Money in Wallet: {{this.currentBalance}}</p>
    </div>
    <div class="input-group">
      <label for="quantity">Quantity:</label>
      <input type="text" #quantity (input)="onInputChange(quantity.value)">
    <p *ngIf="notEnoughMoneyInBalance" style="color: red;">Not enough money in balance</p>
    </div>
    <p>Total: {{this.newCost.toFixed(2)}}</p>
    <button style="background: green;
    border: none;
    color: white;
    font-size: 20px;
    margin-left: 150px;
    cursor: pointer; " mat-button mat-dialog-close (click)="buyStock()">Buy</button>
  `
})
export class BuyDialogComponent {
  protected portfolioListModel: PortfolioListModel;
  protected notEnoughMoneyInBalance = false;
  protected newQuantity: string = '';
  protected newAvg: string = '';
  protected currentPrice: string = '';
  protected totalCost: number = 0.00;
  protected currentBalance: number = 0.00;
  protected newCost: number = 0.00;
  showAlert = false;
  alertMessage = '';
  constructor(public dialogRef: MatDialogRef<BuyDialogComponent>,private alertService: AlertService,
              private mongoDbService: MongoDbService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.portfolioListModel = data.portfolioListModel;

    this.mongoDbService.getBalance().then(res => {
      this.currentBalance = parseFloat(res.currentBalance);
    });
  }

  buyStock() {
    if (this.newCost > this.currentBalance || this.newQuantity === '') {
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

    const newBalance = this.currentBalance - this.newCost;
    const newBalanceModel = new BalanceModel('balance', newBalance.toFixed(2));

    // console.log("new balance:  " + JSON.stringify(newBalanceModel));
    this.mongoDbService.updateTradeItem(newPortFolioModel);
    this.mongoDbService.updateBalance(newBalanceModel);



    this.dialogRef.close();
    this.alertService.showAlert(`${this.portfolioListModel.ticker} bought successfully`);
  }

  onInputChange(qBuy: string) {
    if (qBuy === '') {
      return;
    }



    const quantity = parseInt(qBuy);


    this.mongoDbService.getTradeItem(this.portfolioListModel.ticker).then( res => {
      if (res.status === 404) {
        const currentPrice = this.portfolioListModel.currentPrice;
        const newCost = parseFloat(currentPrice) * quantity;
        const totalCost = parseFloat(currentPrice) * quantity;

        this.mongoDbService.getBalance().then(res => {
          let balance = parseFloat(res.currentBalance);
          // console.log("balance: " + balance)

          if (newCost > balance) {
            // console.log("Not enough money");
            this.notEnoughMoneyInBalance = true;
            return;
          } else {
            this.currentPrice = currentPrice;
            this.newAvg = currentPrice;
            this.newQuantity = quantity.toString();
            this.totalCost = totalCost;
            this.currentBalance = balance;
            this.newCost = newCost;
          }
        });
      }
      else {

        // console.log("tade item already exists: " + JSON.stringify(res))

        const oldAvgCost = parseFloat(res.avgCost);
        const oldShares = parseInt(res.shares, 10);
        const currentPrice = parseFloat(this.portfolioListModel.currentPrice)

        const newShares = oldShares + quantity;

        const totalCost = oldAvgCost * oldShares + currentPrice * quantity;
        const newAvgCost = totalCost / newShares;

        const newCost = currentPrice * quantity;

        this.mongoDbService.getBalance().then(res => {
          let balance = parseFloat(res.currentBalance);
          // console.log("balance: " + balance)

          if (newCost > balance) {
            // console.log("Not enough money");
            this.notEnoughMoneyInBalance = true;
            return;
          } else {
            this.currentPrice = currentPrice.toString();
            this.newAvg = newAvgCost.toString();
            this.newQuantity = newShares.toString();
            this.totalCost = totalCost;
            this.currentBalance = balance;
            this.newCost = newCost
          }
        });
      }
    });
  }
}
