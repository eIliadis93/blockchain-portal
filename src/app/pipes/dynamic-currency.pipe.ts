import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamicCurrency'
})
export class DynamicCurrencyPipe implements PipeTransform {

  constructor() {}

  transform(value: number, code: string): any {
    const decimalPlaces = this.calculateDecimalPlaces(value);
    const format = `1.${decimalPlaces}-${decimalPlaces}`;

    const currencyPipe = new CurrencyPipe('en-US');

    return currencyPipe.transform(value, code, true, format);
  }

  private calculateDecimalPlaces(value: number): number {
    const absValue = Math.abs(value);
    if (absValue >= 1000) {
      return 0;
    } else if (absValue >= 0.1) {
      return 2;
    } else if (absValue >= 0.01) {
      return 4;
    } else {
      return 6;
    }
  }

}
