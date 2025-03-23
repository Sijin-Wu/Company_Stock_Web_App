import { Component,OnDestroy} from '@angular/core';
import {MongoDbService} from "../mongodb.service";
import {NgForOf} from "@angular/common";
import {PortfolioListModel} from "../models/portfolioListModel";
import {FinnhubService} from "../finnhub.service";
import {DialogService} from "../dialog.service";
import { AlertService } from '../alert.service';
import { Subscription } from 'rxjs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    NgForOf, CommonModule, MatProgressSpinner
  ],
  template: `
<div class="portfolio-container">
  <!-- Loading spinner -->
  <div *ngIf="isLoading" class="loading-spinner">
    <mat-spinner diameter="40"></mat-spinner>
  </div>

  <!-- Portfolio content -->
  <div *ngIf="!isLoading">
    <div class="alert" *ngIf="showAlert">
      {{ alertMessage }}
    </div>
    <h1 class="pp">My Portfolio</h1>
    <section *ngIf="isBalanceEmpty(); else portfolioContent">
      <p class="empty-portfolio-message">Currently you don't have any stock</p>
    </section>
    <ng-template #portfolioContent>
      <section>
        <p class="wallet-balance">Money in Wallet: {{currentBalance}}</p>
      </section>
      <section class="portfolio-section" *ngFor="let item of portfolioList">
        <div class="portfolio-header">
          <p class="portfolio-list-item">{{item.ticker}} - {{item.name}}</p>
        </div>
        <div class="stock-info">
          <div>
            <p>Quantity: {{item.shares}}</p>
            <p>Avg. Cost/Share: {{item.avgCost}}</p>
            <p>Total Cost: {{(parseFloat(item.avgCost) * parseInt(item.shares)).toFixed(2)}}</p>
          </div>
          <div>
            <p>Change: {{(parseFloat(item.currentPrice) - parseFloat(item.avgCost)).toFixed(2)}}</p>
            <p>Current Price: {{item.currentPrice}}</p>
            <p>Market Value: {{(parseFloat(item.currentPrice) * parseInt(item.shares)).toFixed(2)}}</p>
          </div>
        </div>
        <div id="bc">
          <button (click)="buy(item)" class="buy-button">Buy</button>
          <button (click)="sell(item)" class="sell-button">Sell</button>
        </div>
      </section>
    </ng-template>
  </div>
</div>


  `,
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnDestroy {
  portfolioList: PortfolioListModel[] =  [];
  currentBalance: string = '';
  private alertSubscription: Subscription;
  showAlert = false;
  alertMessage = '';
  isLoading : boolean = true;

  constructor(private finnhubService: FinnhubService,
              private mongoDbService: MongoDbService,
              private dialogService: DialogService,
              private alertService: AlertService) {
    this.refresh();
    this.alertSubscription = this.alertService.alert$.subscribe(message => {
      this.alertMessage = message;
      this.showAlert = true;
      setTimeout(() => this.showAlert = false, 3000);
    });
  }
  ngOnDestroy() {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }
  refresh() {
    this.isLoading = true;
    this.mongoDbService.getTradeItems().then( res => {
      this.portfolioList = res;

      let pricePromises = this.portfolioList.map(item =>
        this.finnhubService.getCompanyPrice(item.ticker).then(companyPrice => {


          item.currentPrice = companyPrice.c;
        })
      );

      Promise.all(pricePromises).then(() => {
        setTimeout(() => {
          this.isLoading = false;
        }, 3000);
      });
    });

    this.mongoDbService.getBalance().then(res => {
      this.currentBalance = res.currentBalance;
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);
    });
  }

  buy(item: PortfolioListModel) {
    const tradeItem = new PortfolioListModel(item.ticker, item.name,
      item.avgCost, item.shares, item.currentPrice);
    this.dialogService.openBuyDialog(tradeItem);
    this.refresh();

  }

  sell(item: PortfolioListModel) {
    const tradeItem = new PortfolioListModel(item.ticker, item.name,
      item.avgCost, item.shares, item.currentPrice);
    this.dialogService.openSellDialog(tradeItem);
    this.refresh();
  }

  protected readonly parseInt = parseInt;
  protected readonly parseFloat = parseFloat;

  isBalanceEmpty(): boolean {
    console.log("currentB"+this.currentBalance);
    return this.currentBalance === '25000.00';
  }

}
