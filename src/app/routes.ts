import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WatchListComponent} from "./watchlist/watchlist.component";
import {PortfolioComponent} from "./portfolio/portfolio.component";

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page'
  },
  {
    path: 'watchlist',
    component: WatchListComponent,
    title: 'watchlist'
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
    title: 'portfolio'
  },
  {
    path: 'search/:ticker',
    component: HomeComponent,
    title: 'Home page'
  },
];

export default routeConfig;


