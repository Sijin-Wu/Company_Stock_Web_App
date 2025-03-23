import { Component, Input} from "@angular/core";
import { CommonModule} from "@angular/common";
import {Router, RouterModule} from '@angular/router';
import { WatchListModel } from '../models/watchListModel'
import {MongoDbService} from "../mongodb.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterModule, MatProgressSpinner],
  template: `

<h1>My WatchList</h1><br><br>
<div class="watchlist-container">
  <div *ngIf="isLoading" class="loading-spinner">
    <mat-spinner diameter="40"></mat-spinner>
  </div>
  <div *ngIf="!isLoading && watchlist?.length === 0" class="empty-watchlist-message">
    Currently you don't have any stock in your watchlist.
  </div>

  <ng-container *ngIf="!isLoading && watchlist.length > 0">
    <section class="watchList" *ngFor="let watchlistItem of watchlist; let i = index">
      <div class="watch-list-item card" *ngIf="watchlistItem.isVisible" (click)="goToHome(watchlistItem.ticker)">
        <div class="content">
          <div class="left-side">
            <span class="ticker">{{ watchlistItem.ticker }}</span>
            <span class="name">{{ watchlistItem.name }}</span>
          </div>
          <div class="right-side">
            <span class="price">{{ watchlistItem.price }}</span>
            <span>{{ roundToTwo(watchlistItem.priceChange) }} ({{ roundToTwo(watchlistItem.priceChangePercent) }}%)</span>
          </div>
        </div>
        <button class="close-btn" (click)="closeCard(i, $event)">X</button>
      </div>
    </section>
  </ng-container>
</div>


  `,
  styleUrl: './watchlist.component.css'
})

export class WatchListComponent {
  watchlist: WatchListModel[] =  [];
  isLoading : boolean = true;
  constructor(private mongoDbService: MongoDbService,private cdr: ChangeDetectorRef,
  private router:Router) {
    this.refresh();
  }
  refresh() {
    this.isLoading = true;
    this.mongoDbService.getItems().then(res => {
      setTimeout(() => {
        this.watchlist = res || [];
        this.isLoading = false;
      }, 3000);
    }).catch(error => {
      console.error("Error fetching watchlist data", error);
      this.watchlist = [];
      this.isLoading = false;
    });
  }

  goToHome(ticker: string) {

    this.router.navigate(['/search', ticker ]);
  }

  closeCard(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.watchlist[index].isVisible = false;
  }
  roundToTwo(num: number): string {
    return num.toFixed(2);
  }

  protected readonly JSON = JSON;
}
