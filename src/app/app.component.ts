import { Component } from '@angular/core';
import { CurrencyChangesService } from './service/currency-changes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'blockchain-portal';
  selectedCurrency: any;

  constructor( private currencyChanges: CurrencyChangesService) {}

  sendCurrency(event: string) {
    console.log(event);
    this.currencyChanges.setCurrency(event);
  }
}
