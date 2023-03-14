import { Component, OnInit } from '@angular/core';
import { CurrencyChangesService } from '../service/currency-changes.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{

  selectedCurrency: any;

  constructor( private currencyChanges: CurrencyChangesService) {}

  sendCurrency(event: string) {
    console.log(event);
    this.currencyChanges.setCurrency(event);
  }

}
