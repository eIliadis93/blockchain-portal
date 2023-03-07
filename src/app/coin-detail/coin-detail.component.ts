import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCoingeckoService } from '../service/api-coingecko.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss'],
})
export class CoinDetailComponent implements OnInit {
  coin: any;
  coinId!: string;
  days: number = 1;
  currency: string = 'EUR';

  constructor(
    private coingecko: ApiCoingeckoService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((value) => {
      this.coinId = value['id'];
    });
    this.getCryptoCurrencyData();
  }

  getCryptoCurrencyData() {
    this.coingecko.getCryptoCurrencyById(this.coinId).subscribe((res) => {
      this.coin = res;
      console.log(this.coin);
    });
  }
}
