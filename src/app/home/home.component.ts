import {Component, inject} from "@angular/core";
import {AsyncPipe, CommonModule} from "@angular/common";
import {FinnhubService} from "../finnhub.service";
import {News} from "../news";
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MongoDbService} from "../mongodb.service";
import {WatchListModel} from "../models/watchListModel";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {DialogService} from "../dialog.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import {PortfolioListModel} from "../models/portfolioListModel";
import {  OnDestroy } from '@angular/core';
import { AlertService } from '../alert.service';
import {finalize, Subscription} from 'rxjs';
import {ColumnStackChartComponent} from "../charts/trends.component";
import {EPSChartComponent} from "../charts/eps.component";
import { HighchartsChartModule } from 'highcharts-angular';
import {HistoryChartComponent} from "../charts/history.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import {HourChartComponent} from "../charts/hourChange.component";
import {json} from "express"; // Import HttpClientModule
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule, HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe, ColumnStackChartComponent, EPSChartComponent, HighchartsChartModule, EPSChartComponent, EPSChartComponent, HistoryChartComponent, HourChartComponent],
  template: `


    <section>
      <div class="title">STOCK SEARCH</div>
      <div class="search-box" style="position: relative;" (mouseleave)="clearAutoComplete()">
        <input type="text" placeholder="Enter stock ticker symbol" id="search-input" [(ngModel)]="ticker" (input)="autoComplete(ticker)" style="width: 100%;">
        <button (click)="callAllFunction(ticker)">
          <i class="search-icon">🔍</i>
        </button>
        <button (click)="clearSearch()">
          <i class="clear-icon">✖️</i>
        </button>
        <ul *ngIf="filteredOptions.length || isLoading" class="autocomplete-dropdown" style="position: absolute; top: 100%; left: 0; right: 0; z-index: 1000;">
          <li *ngIf="isLoading" class="loading-spinner" style="text-align: center; padding: 10px;">
            <mat-spinner diameter="20"></mat-spinner>
          </li>
          <li *ngFor="let option of filteredOptions" (click)="selectOption(option)" style="background: white; cursor: pointer; padding: 5px 10px;">
            {{ option.displaySymbol }} | {{option.description}}
          </li>
        </ul>
      </div>



      <div *ngIf="errorMessage" class="error-message">{{errorMessage}}</div>
    </section>
    <br><br>
    <section>
      <div *ngIf="errorMessage === undefined">
        <div *ngIf="companyProfile">
          <div class = "container">
            <div class = "company-profile">
              <div class="alert" *ngIf="showAlert">
                {{ alertMessage }}
              </div>
              <div class = "firstE">
                {{ companyProfile.ticker }}
                <button (click)="addOrRemoveWatchList()">
                  <i class="inWatchList" *ngIf="isInWatchList">⭐</i>
                  <i class="notInWatchList" *ngIf="!isInWatchList">&#9734;</i>
                </button>
              </div>
              <p class="secondE">{{ companyProfile.name }}</p>
              <p class ="thirdE">{{ companyProfile.exchange }}</p>

              <div class="button-container">
                <button (click)="buy()" class="buy-button">Buy</button>
                <button (click)="sell()" class="sell-button">Sell</button>
              </div>

            </div>
            <div class ="company-logo">
              <img [src]="companyProfile.logo" alt="Company Logo">
            </div>
            <div class ="company-price" [ngClass]="{'green': companyPrice.d > 0, 'red': companyPrice.d < 0}">
              <p class = "firstE" [ngClass]="{'green': companyPrice.d > 0, 'red': companyPrice.d < 0}">{{ roundToTwo(companyPrice.c) }}</p>
              <p class="secondE" [ngClass]="{'green': companyPrice.d > 0, 'red': companyPrice.d < 0}">
                <span *ngIf="companyPrice.d > 0" class="triangle-up"></span>
                <span *ngIf="companyPrice.d < 0" class="triangle-down"></span>
                {{ roundToTwo(companyPrice.d) }}({{roundToTwo(companyPrice.dp) }}%)
              </p>
              <p class ="thirdE">{{currentDateTime}}</p>
            </div>
          </div>
          <p id ="statusM">{{ marketStatus}}</p>
        </div>
        <br><br><br><br>

        <div *ngIf="showTabs" >
          <ul class="tab-list">
            <li [class.active]="isTabActive('summary')" (click)="setActiveTab('summary')">Summary</li>
            <li [class.active]="isTabActive('top-news')" (click)="setActiveTab('top-news')">Top News</li>
            <li [class.active]="isTabActive('charts')" (click)="setActiveTab('charts')">Charts</li>
            <li [class.active]="isTabActive('insights')" (click)="setActiveTab('insights')">Insights</li>
          </ul>

          <div [ngSwitch]="activeTab"><br>
            <div *ngSwitchCase="'summary'" class ="summary-container">
              <div class="left-summary">
              <div class = "summaryP1">
                <p><b>High Price</b>: {{ companyPrice.h }}</p>
                <p><b>Low Price</b>: {{ companyPrice.l }}</p>
                <p><b>Open Price</b>: {{ companyPrice.o }}</p>
                <p><b>Prev. Close</b>: {{ companyPrice.pc }}</p>
              </div>
                <br><br>

              <div class ="summaryP2">
                <p id ="aboutC"> About the company</p> <br><br>
                <p><b>IPO Start Date</b>: {{ companyProfile.ipo }}</p><br>
                <p><b>Industry</b>: {{ companyProfile.finnhubIndustry }}</p><br>
                <p><b>Webpage</b>:<a href="{{ companyProfile.weburl }}">{{ companyProfile.weburl }}</a></p><br>
                <p><b>Company Peers</b>:</p><br>
                <p>{{companyPeer}}</p>

              </div>
              </div>
              <div class ="summaryP3">
                <app-hour-chart [data] = this.companyHourCharts [ticker] = this.ticker></app-hour-chart>
              </div>
            </div>

            <div *ngSwitchCase="'top-news'" class = "news-container">

              <div *ngFor="let newsItem of companyNews" class="news-item" (click)="openDialog(newsItem)">
                <img [src]="newsItem.image" alt="News Image">
                <h3 class = "news-title">{{ newsItem.headline }}</h3>

              </div>
            </div>

            <div *ngSwitchCase="'charts'">
              <app-history-chart [data] = this.companyCharts [ticker] = this.ticker></app-history-chart>
            </div>

            <div *ngSwitchCase="'insights'">
              <p id ="tab4F">Insider Sentiments</p>
              <div class="table-container">
                <table>
                  <tr class="header">
                    <td colspan="2">{{companyProfile.name }}</td>
                    <td>MSPR</td>
                    <td>Change</td>
                  </tr>
                  <tr>
                    <th>Total</th>
                    <td></td>
                    <td>{{roundToTwo(totalMspr)}}</td>
                    <td>{{roundToTwo(totalChange)}}</td>
                  </tr>
                  <tr>
                    <th>Positive</th>
                    <td></td>
                    <td>{{roundToTwo(totalPositiveMspr)}}</td>
                    <td>{{roundToTwo(totalPositiveChange)}}</td>
                  </tr>
                  <tr>
                    <th>Negative</th>
                    <td></td>
                    <td>{{roundToTwo(totalNegativeMspr)}}</td>
                    <td>{{roundToTwo(totalNegativeChange)}}</td>
                  </tr>
                </table>
              </div>

              <app-trends-chart [data] = this.companyTrends></app-trends-chart>
              <app-eps-chart [data] = this.companyEarning>></app-eps-chart>

            </div>

          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnDestroy{
  companyProfile: any;
  companyPrice: any;
  companyNews: any;
  errorMessage: string | undefined;
  newsArray: Array<News> = [];
  companyCharts: any;
  companyHourCharts: any;
  companyInsider: any;
  companyPeer: any;
  companyEarning: any;
  companyTrends: any;
  companyAuto: any;
  ticker: string ='';
  activeTab: string = 'summary';
  showTabs: boolean = false;
  isValidTicker: boolean = false;
  isInWatchList: boolean = false;
  private modalService = inject(NgbModal);
  totalMspr : number=0;
  totalPositiveMspr: number=0;
  totalNegativeMspr:number=0;
  totalChange:number=0;
  totalPositiveChange:number=0;
  totalNegativeChange:number=0;
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: any[] = [];
  private alertSubscription: Subscription;
  showAlert = false;
  alertMessage = '';
  currentDateTime:any;
  marketStatusMessage:any;
  marketStatus: any;
  marketClose: any;
  isLoading : boolean = false;
  constructor(private finnhubService: FinnhubService,
              private mongoDbService: MongoDbService,
              private dialogService: DialogService,
              private router: Router,
              private http: HttpClient,
              private route: ActivatedRoute,
              private alertService: AlertService) {
    this.currentDateTime = this.getCurrentDateTime();

    this.alertSubscription = this.alertService.alert$.subscribe(message => {
      this.alertMessage = message;
      this.showAlert = true;

      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    });

  }



  checkMarketStatus(): void {
    const currentTime = new Date(this.currentDateTime);
    const closingTime = new Date(this.companyPrice.t);
    closingTime.setMinutes(closingTime.getMinutes() + 5); // Add 5 minutes to the market closing time

    if (currentTime > closingTime) {
      this.marketStatus = `market closed on ${this.formatTimestamp(this.companyPrice.t)}`;
    } else {
      this.marketStatus = "market is open";
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['ticker']) {
        this.ticker = params['ticker'];
        this.callAllFunction(params['ticker']);
      }
    });
  }

  getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = this.padZero(now.getMonth() + 1); // getMonth() is 0-indexed
    const day = this.padZero(now.getDate());
    const hours = this.padZero(now.getHours());
    const minutes = this.padZero(now.getMinutes());
    const seconds = this.padZero(now.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  ngOnDestroy() {
    this.alertSubscription.unsubscribe();
  }

  buy() {
    const tradeItem = new PortfolioListModel(this.ticker, this.companyProfile.name,
      "", "", this.companyPrice.c);
    this.dialogService.openBuyDialog(tradeItem);
  }

  sell() {
    const tradeItem = new PortfolioListModel(this.ticker, this.companyProfile.name,
      "", "", this.companyPrice.c);
    this.dialogService.openSellDialog(tradeItem);
  }

  setActiveTab(tabName: string):void{
    // console.log('tabName2: ' + tabName);
    this.activeTab = tabName;
  }
  isTabActive(tabName: string):boolean{
    // console.log('tabName: ' + tabName);
    return this.activeTab ===tabName;
  }



  clearSearch(){
    this.ticker ='';
    this.errorMessage = '';
  }

  callAllFunction(text: string): void{

    this.searchCompanyProfile(text);
    this.searchCompanyPrice(text);
    this.searchCompanyNews(text);
    this.searchCompanyCharts(text);
    this.searchSummaryCharts(text);
    this.searchCompanyInsider(text);
    this.searchCompanyPeer(text);
    this.searchCompanyEarning(text);
    this.searchCompanyTrends(text);
    this.searchCompanyAuto(text);
    this.checkMarketStatus();
  }

  searchCompanyPrice(text: string): void {
    if (text) {
      console.log(text);

      this.finnhubService.getCompanyPrice(text).then(data => {
        console.log("htmlLog price:  " + JSON.stringify(data));
        console.log("htmlLog price tiker:  " + this.ticker);
        console.log("htmlLog price isValitiker:  " + this.isValidTicker);


        if (this.isValidTicker){
          this.companyPrice = data;
        }
      });
    } else {
      this.errorMessage = 'Please enter a ticker symbol';
    }
  }

  searchCompanyProfile(text: string): void {
    if (text) {

      this.finnhubService.getCompanyProfile(text).then(res => {

        console.log("htmlLog profile:  " + JSON.stringify(res));

        // Profile
        const profile = res;
        if (profile.ticker != undefined){
          this.errorMessage = undefined;
          this.companyProfile = profile;
          this.showTabs =true;
          this.isValidTicker =true;
        }else{
          this.errorMessage = "No data found. Please enter a valid ticker";
          this.isValidTicker =false;
        }

      });

      this.mongoDbService.getItem(text).then( res => {
        if (res.status === 404) {
          this.isInWatchList = false;
        }
        else {
          this.isInWatchList = true;
        }
      });

    } else {
      this.errorMessage = 'Please enter a ticker symbol';
      this.isValidTicker =false;
    }
    console.log(text);
  }


  searchCompanyNews(text: string): void {

    if (text) {
      // console.log(text);
      const res = this.finnhubService.getCompanyNews(text).then(data => {

        if (this.isValidTicker) {
          this.companyNews = data
            .sort((a: News, b: News) => Number(b.datetime) - Number(a.datetime))
            .map((item: { datetime: any; }) => {
              item.datetime = this.getDateTime(Number(item.datetime));
              // item.datetime = "2024-01-01";
              return item;
            })
            .filter(((item: { image: any; headline: any; }) => item.image && item.headline))
            .slice(0, 20);
        }
      });
    } else {
      this.errorMessage = 'Please enter a ticker symbol';
    }
  }

  searchCompanyCharts(text: string): void {
    if (text) {
      // console.log(text);

      const res = this.finnhubService.getCompanyCharts(text).then(data => {
        this.companyCharts= data.results;

        });
    } else {
      this.errorMessage = 'Please enter a ticker symbol';
    }
  }

  searchSummaryCharts(text: string): void {
    if (text) {
      // console.log(text);

      const res = this.finnhubService.getTab1Charts(text).then(data => {

        console.log("htmlLog tab1 chats:  " + JSON.stringify(data));

        this.companyHourCharts= data.results;
        // console.log("tab1chars:   " + JSON.stringify(data));
      });
    } else {
      this.errorMessage = 'Please enter a ticker symbol';
    }
  }

  searchCompanyInsider(text: string): void {
    if (text) {
      console.log(text);

      const res = this.finnhubService.getCompanyInsider(text).then(data => {

        this.companyInsider= data.data;
        this.totalMspr = this.aggregateMspr(this.companyInsider);
        console.log('Total MSPR:', this.totalMspr);
        this.totalPositiveMspr = this.aggregatePositiveMspr(this.companyInsider);
        console.log('Total Positive MSPR:', this.totalPositiveMspr);
        this.totalNegativeMspr = this.aggregateNegativeMspr(this.companyInsider);
        console.log('Total Negative MSPR:', this.totalNegativeMspr);
        this.totalChange = this.aggregateChange(this.companyInsider);
        console.log('Total Change:', this.totalChange);
        this.totalPositiveChange = this.aggregatePositiveChange(this.companyInsider);
        console.log('Total Positive Change:', this.totalPositiveChange);
        this.totalNegativeChange = this.aggregateNegativeChange(this.companyInsider);
        console.log('Total Positive Change:', this.totalNegativeChange);
      });
    } else {
      this.errorMessage = 'Please enter a ticker symbol';
    }
  }

  aggregateMspr(data: any[]): number{
    return data.reduce((sum, item) => sum + item.mspr, 0);
  }
  aggregatePositiveMspr(data: any[]): number {
    return data
      .filter(item => item.mspr > 0)
      .reduce((sum, item) => sum + item.mspr, 0);
  }
  aggregateNegativeMspr(data: any[]): number {
    return data
      .filter(item => item.mspr < 0)
      .reduce((sum, item) => sum + item.mspr, 0);
  }
  aggregateChange(data: any[]): number {
    return data.reduce((sum, item) => sum + item.change, 0);
  }
  aggregatePositiveChange(data: any[]): number {
    return data
      .filter(item => item.change > 0)
      .reduce((sum, item) => sum + item.change, 0);
  }
  aggregateNegativeChange(data: any[]): number {
    return data
      .filter(item => item.change < 0)
      .reduce((sum, item) => sum + item.change, 0);
  }


  searchCompanyPeer(text: string): void {
    if (text) {
      console.log(text);

      const res = this.finnhubService.getCompanyPeer(text).then(data => {
        this.companyPeer = data;
        // console.log(data)
      });
    } else {
      this.errorMessage = 'Please enter a ticker symbol';
    }
  }

  searchCompanyEarning(text: string): void {
    if (text) {
      console.log(text);

      const res = this.finnhubService.getCompanyEarning(text).then(data => {
        this.companyEarning = data;
        // console.log(data)
      });

    } else {
      this.errorMessage = 'Please enter a ticker symbol';
    }
  }

  searchCompanyTrends(text: string): void {
    if (text) {
      // console.log(text);

      const res = this.finnhubService.getCompanyTrends(text).then(data => {
        this.companyTrends = data;
        // console.log(data)
      });
    } else {
      this.errorMessage = 'Please enter a ticker symbol';
    }
  }


  autoComplete(searchValue: string): void {
    if (searchValue) {
      this.isLoading = true;
      this.searchCompanyAuto(searchValue)
        .then((results) => {


          this.filteredOptions = results;
        })
        .catch((error) => {
          this.filteredOptions = [];
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.filteredOptions = [];
    }
  }


  searchCompanyAuto(text: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (text) {
        console.log(text);
        this.finnhubService.getCompanyAuto(text).then(data => {

          console.log("htmlLog auto:  " + JSON.stringify(data));

          this.companyAuto = data.result;
          this.filteredOptions = this.companyAuto.slice(0, 5);
          resolve(this.filteredOptions);
        }).catch(error => {
          console.error("Error fetching company autocomplete data", error);
          this.filteredOptions = [];
          reject(error);
        });
      } else {
        this.companyAuto = [];
        this.filteredOptions = [];
        resolve([]);
      }
    });
  }


  selectOption(option: any): void {
    this.ticker = option.displaySymbol;
    this.filteredOptions = [];
    this.callAllFunction(this.ticker);
  }

  clearAutoComplete(): void {
    this.filteredOptions = [];
  }


  getDateTime(datetime: number){

    let date: Date = new Date(datetime * 1000);
    let formattedDate: string = date.toISOString().split('T')[0];
    // console.log(formattedDate);
    return formattedDate;
  }

  addOrRemoveWatchList() {
    const watchListItem = new WatchListModel(
      this.companyProfile.ticker,
      this.companyProfile.name,
      this.companyPrice.c,
      this.companyPrice.d,
      this.companyPrice.dp
    )


    this.mongoDbService.getItem(this.companyProfile.ticker).then( res => {
      if (res.status === 404) {
        this.mongoDbService.updateItem(watchListItem);
        this.isInWatchList = true;
      }
      else {
        this.mongoDbService.deleteItem(watchListItem)
        this.isInWatchList = false;
      }
    });
  }



  roundToTwo(num: number): string {
    return num.toFixed(2);
  }
  openDialog(newsItem: any) {
    this.dialogService.openDialog(newsItem.source, newsItem.datetime, newsItem.headline, newsItem.summary, newsItem.url);
  }
  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const seconds = this.padZero(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }
}


