import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCoingeckoService } from '../service/api-coingecko.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CurrencyChangesService } from '../service/currency-changes.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss'],
})
export class CoinDetailComponent implements OnInit {
  coin: any;
  coinId!: string;
  days: number = 30;
  currency: string = 'EUR';
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#FF00FF',
        pointBackgroundColor: '#FF00FF',
        pointBorderColor: '#FF00FF',
        pointHoverBackgroundColor: '#FF00FF',
        pointHoverBorderColor: '#FF00FF',
      },
    ],
    labels: [],
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1,
      },
    },

    plugins: {
      legend: { display: true },
    },
  };
  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart!: BaseChartDirective;

  constructor(
    private coingecko: ApiCoingeckoService,
    private activatedRoute: ActivatedRoute,
    private currencyChanges: CurrencyChangesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((val) => {
      this.coinId = val['id'];
    });
    this.getCryptoCurrencyData();
    this.getGraphData(this.days);
    this.currencyChanges.getCurrency().subscribe((val) => {
      this.currency = val;
      this.getGraphData(this.days);
      this.getCryptoCurrencyData();
    });
  }

  getCryptoCurrencyData() {
    this.coingecko.getCryptoCurrencyById(this.coinId).subscribe((res) => {
      this.coin = res;
      if (this.currency === 'USD') {
        res.market_data.current_price.eur = res.market_data.current_price.usd;
        res.market_data.market_cap.eur = res.market_data.market_cap.usd;
      }
      res.market_data.current_price.eur = res.market_data.current_price.eur;
      res.market_data.market_cap.eur = res.market_data.market_cap.eur;
      this.coin = res;
    });
  }

  getGraphData(days: number) {
    this.days = days;
    this.coingecko
      .getGraphicalCryptoCurrencyData(this.coinId, this.currency, this.days)
      .subscribe((res) => {
        setTimeout(() => {
          this.myLineChart.chart?.update();
        }, 200);
        this.lineChartData.datasets[0].data = res.prices.map((a: any) => {
          return a[1];
        });
        this.lineChartData.labels = res.prices.map((a: any) => {
          let date = new Date(a[0]);
          let time =
            date.getHours() > 12
              ? `${date.getHours() - 12}: ${date.getMinutes()} PM`
              : `${date.getHours()}: ${date.getMinutes()} AM`;
          return this.days === 1 ? time : date.toLocaleDateString();
        });
      });
  }
}
