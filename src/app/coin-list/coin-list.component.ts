import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ApiCoingeckoService } from '../service/api-coingecko.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss'],
})
export class CoinListComponent implements OnInit {
  banner: any = [];
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'symbol',
    'current_price',
    'price_change_percentage_24h',
    'market_cap',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private coingecko: ApiCoingeckoService, private router: Router) {}

  ngOnInit(): void {
    this.getBanner();
    this.getAllCryptos();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getBanner() {
    this.coingecko.getTrendingCryptoCurrency('EUR').subscribe((res) => {
      console.log('Trending: ', res);
      this.banner = res;
    });
  }

  getAllCryptos() {
    this.coingecko.getCryptoCurrencyData('EUR').subscribe((res) => {
      console.log('All cryptos: ', res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  redirectToDetails(row:any) {
    this.router.navigate(['coin-detail', row.id]);
    console.log('hello');
  }
}
