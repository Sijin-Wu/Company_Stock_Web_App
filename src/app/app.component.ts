import { Component } from '@angular/core';
import {HomeComponent} from "./home/home.component";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent,RouterModule],
  template: `
    <main>
<!--      <a [routerLink]="['/']">-->
        <div class="navbar">
          <div class="navbar-brand">Stock Search</div>
          <ul class="nav">
            <li><a [routerLink]="['/']">Search</a></li>
            <li><a [routerLink]="['/watchlist']">Watchlist</a></li>
            <li><a [routerLink]="['/portfolio']">Portfolio</a></li>
          </ul>
        </div>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
      <div class="powered-by-container">
        Powered by <a href ="https://finnhub.io" target="_blank">Finnhub.io</a>
      </div>
    </main>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'homes';
}
