import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiCoingeckoService {
  geckoHttp = 'https://api.coingecko.com/api/v3/coins/';

  constructor(private http: HttpClient) {}

  getCryptoCurrencyData(currency: string) {
    return this.http.get<any>(
      this.geckoHttp +
        `markets?vs_currency=${currency}&order=market_cap_desc&sparkline=false`
    );
  }

  getTrendingCryptoCurrency(currency: string) {
    return this.http.get<any>(
      this.geckoHttp +
        `markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
    );
  }

  getGraphicalCryptoCurrencyData(
    coinId: string,
    currency: string,
    days: number
  ) {
    return this.http.get<any>(
      this.geckoHttp +
        `${coinId}/market_chart?vs_currency=${currency}&days=${days}`
    );
  }

  getCryptoCurrencyById(coinId: string) {
    return this.http.get<any>(this.geckoHttp + `${coinId}`);
  }
}
