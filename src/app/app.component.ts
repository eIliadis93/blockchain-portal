import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'blockchain-portal';
  selectedCurrency: any;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('footer') footer!: ElementRef;
  
  maxContentHeight!: number;

  ngOnInit() {
    this.calculateMaxContentHeight();
  }

  calculateMaxContentHeight() {
    const windowHeight = window.innerHeight;
    const headerHeight = this.header.nativeElement.offsetHeight;
    const footerHeight = this.footer.nativeElement.offsetHeight;
    this.maxContentHeight = windowHeight - headerHeight - footerHeight;
  }
}
