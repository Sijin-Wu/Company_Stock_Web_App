
export class WatchListModel {
  isVisible: boolean; // Add this line
  constructor(
    public ticker: string,
    public name: string,
    public price: number,
    public priceChange: number,
    public priceChangePercent: number,
  ){
    this.isVisible = true;
  }
}
