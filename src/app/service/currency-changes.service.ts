import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyChangesService {
  private currency$: BehaviorSubject<string> = new BehaviorSubject<string>(
    'EUR'
  );

  constructor() {}

  getCurrency() {
    return this.currency$.asObservable();
  }

  setCurrency(currency: string) {
    this.currency$.next(currency);
  }
}
