import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FinnhubService {
  private serverUrl = 'http://Hw3-api-server-env.eba-bvvkvk9e.us-east-2.elasticbeanstalk.com';

  getDate():string{
    const today = new Date();
    const year =today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }



  getOneWeekBeforeDate(): string {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const year = oneWeekAgo.getFullYear();
    const month = String(oneWeekAgo.getMonth() + 1).padStart(2, '0');
    const day = String(oneWeekAgo.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  getSixMonthsAndOneDayBeforeDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  async getCompanyPrice(ticker: string): Promise<any>{
    const data = await fetch(`${this.serverUrl}/getCompanyPrice/${ticker}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });

    console.log("finhub price" + JSON.stringify(data));

    return await data.json();
  }


  async getCompanyProfile(ticker: string): Promise<any> {
    const data = await fetch(`${this.serverUrl}/getCompanyProfile/${ticker}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });

    console.log("finhub profile" + JSON.stringify(data));

    return await data.json();
  }

  async getCompanyNews(ticker: string): Promise<any>{
    const data = await fetch(`${this.serverUrl}/getCompanyNews/${ticker}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });


    console.log("finhub news:   " + JSON.stringify(data));
    return await data.json();
  }

  async getCompanyCharts(ticker: string): Promise<any>{
    const data = await fetch(`${this.serverUrl}/getCompanyCharts/${ticker}`);
    return await data.json();
  }

  async getTab1Charts(ticker: string): Promise<any>{
    let endDate = new Date();
    let startDate = new Date();

    const timezoneOffset = -7;
    endDate.setHours(endDate.getHours() + timezoneOffset);
    startDate.setHours(startDate.getHours() + timezoneOffset);
    const currentHour = endDate.getHours();

    const marketOpenHour = 9 - 3;
    const marketCloseHour = 16 - 3;

    if (currentHour < marketOpenHour || currentHour >= marketCloseHour || endDate.getDay() === 6 || endDate.getDay() === 0) {

      const dayOffset = endDate.getDay() === 0 ? 2 : 1;

      startDate.setDate(startDate.getDate() - dayOffset - 1);
      endDate.setDate(endDate.getDate() - dayOffset);
    } else {
      startDate.setDate(startDate.getDate() - 1);
    }

    const from = this.formatDate(startDate);
    const to = this.formatDate(endDate);


    const data = await fetch(`${this.serverUrl}/getTab1Charts/${ticker}/${from}/${to}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });

    console.log("finhub tab1:  " + JSON.stringify(data));

    return await data.json();
  }

  formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  async getCompanyInsider(ticker: string): Promise<any> {
    const data = await fetch(`${this.serverUrl}/getCompanyInsider/${ticker}`);
    return await data.json();
  }
  async getCompanyPeer(ticker: string): Promise<any> {
    const data = await fetch(`${this.serverUrl}/getCompanyPeer/${ticker}`);
    return await data.json();
  }
  async getCompanyEarning(ticker: string): Promise<any> {
    const data = await fetch(`${this.serverUrl}/getCompanyEarning/${ticker}`);
    return await data.json();
  }
  async getCompanyAuto(ticker: string): Promise<any> {
    const data = await fetch(`${this.serverUrl}/getCompanyAuto/${ticker}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });

    console.log("finhub auto:  " + JSON.stringify(data));

    return await data.json();
  }

  async getCompanyTrends(ticker: string): Promise<any> {
    const data = await fetch(`${this.serverUrl}/getCompanyTrends/${ticker}`);
    return await data.json();
  }

}
