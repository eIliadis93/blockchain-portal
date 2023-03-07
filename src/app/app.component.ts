import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'blockchain-portal';
  selectedCurrency: any;

  constructor() {}

  sendCurrency($event: string) {
    console.log($event);
  }
}
