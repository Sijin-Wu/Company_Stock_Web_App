import { Injectable } from '@angular/core';
import {WatchListModel} from "./models/watchListModel";
import {PortfolioListModel} from "./models/portfolioListModel";
import {BalanceModel} from "./models/balanceModel";



@Injectable({
  providedIn: 'root'
})
export class MongoDbService {

  private apiUrl = 'http://Hw3-mongdbServer-env.eba-ykmez6am.us-east-2.elasticbeanstalk.com';
  async getItems(): Promise<any> {
    const data = await fetch(`${this.apiUrl}/getItems`)
      .then(response => response.json());
    return await data;
  }

  async getItem(ticker: string): Promise<any> {
    const data = await fetch(`${this.apiUrl}/getItem/${ticker}`).then(response => response.json());
    console.log("getItem: " + JSON.stringify(data));
    return await data;
  }

  async updateItem( item: WatchListModel): Promise<any> {
    const data = await fetch(`${this.apiUrl}/updateItem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
      .then(response => response.json());
    console.log("updateItem: " + JSON.stringify(data));
    return await data;
  }

  async deleteItem( item: WatchListModel): Promise<any> {
    const data = await fetch(`${this.apiUrl}/deleteItem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
      .then(response => response.json());
    console.log("deleteItem: " + JSON.stringify(data));
    return await data;
  }

  async getTradeItems(): Promise<any> {
    const data = await fetch(`${this.apiUrl}/getTradeItems`)
      .then(response => response.json());
    return await data;
  }

  async getTradeItem(ticker: string): Promise<any> {
    const data = await fetch(`${this.apiUrl}/getTradeItem/${ticker}`).then(response => response.json());
    console.log("getTradeItem: " + JSON.stringify(data));
    return await data;
  }

  async updateTradeItem( item: PortfolioListModel): Promise<any> {
    const data = await fe
    })
      .then(response => response.json());
    console.log("updateTratch(`${this.apiUrl}/updateTradeItem`, {\n"+
      "      method: 'POST',\n"+
      "      headers: {\n"+
      "        'Content-Type': 'application/json'\n"+
      "      },\n"+
      "      body: JSON.stringify(item)deItem: " + JSON.stringify(data));
    return await data;
  }

  async deleteTradeItem( item: PortfolioListModel): Promise<any> {
    const data = await fetch(`${this.apiUrl}/deleteTradeItem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
      .then(response => response.json());
    console.log("deleteTradeItem: " + JSON.stringify(data));
    return await data;
  }


  async getBalance(): Promise<any> {
    const data = await fetch(`${this.apiUrl}/getBalance`).then(response => response.json());
    console.log("getBalance: " + JSON.stringify(data));
    return await data;
  }

  async updateBalance( item: BalanceModel): Promise<any> {
    const data = await fetch(`${this.apiUrl}/updateBalance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
      .then(response => response.json());
    console.log("updateItem: " + JSON.stringify(data));
    return await data;
  }
}
