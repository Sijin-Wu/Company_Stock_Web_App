export class PortfolioListModel {
  constructor(
    public ticker: string,
    public name: string,
    public avgCost: string,
    public shares: string,
    public currentPrice: string
  ){}
}
