import { BlockchainTransactionComponent } from './blockchain-transaction/blockchain-transaction.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinDetailComponent } from './coin-detail/coin-detail.component';
import { CoinListComponent } from './coin-list/coin-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'coin-list', component: CoinListComponent },
  { path: 'coin-detail/:id', component: CoinDetailComponent },
  { path: 'home', component: HomeComponent },
  { path: 'transaction', component: BlockchainTransactionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
