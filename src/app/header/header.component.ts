import { MetamaskService } from './../service/metamask.service';
import { Component, OnInit } from '@angular/core';
import { CurrencyChangesService } from '../service/currency-changes.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public connected = false;
  public errorMessage = '';
  selectedCurrency: any;

  constructor(
    private currencyChanges: CurrencyChangesService,
    private metamaskService: MetamaskService
  ) {}

  async checkMetamaskInstalled() {
    const isInstalled = await this.metamaskService.isMetamaskInstalled();
    if (!isInstalled) {
      this.errorMessage =
        'Metamask is not installed. Please install Metamask and refresh the page.';
    }
  }

  sendCurrency(event: string) {
    this.currencyChanges.setCurrency(event);
  }

  async connect() {
    this.checkMetamaskInstalled();
    try {
      await this.metamaskService.connect();
      this.connected = true;
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  async disconnect() {
    try {
      await this.metamaskService.disconnect();
      this.connected = false;
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}
