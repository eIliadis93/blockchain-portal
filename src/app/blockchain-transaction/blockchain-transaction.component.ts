import { Component, OnInit } from '@angular/core';
import { MetamaskService } from '../service/metamask.service';

interface CoinVariant {
  name: string;
  value: string;
}

@Component({
  selector: 'app-blockchain-transaction',
  templateUrl: './blockchain-transaction.component.html',
  styleUrls: ['./blockchain-transaction.component.scss'],
})
export class BlockchainTransactionComponent implements OnInit {
  public fromAddress!: string;
  public toAddress!: string;
  public amount!: number;
  public coinVariants: CoinVariant[] = [
    { name: 'Ethereum', value: 'ETH' },
  ];
  public selectedCoin: string = 'ETH';
  address!: string;
  transactions: any[] = [];

  constructor(private metamaskService: MetamaskService) {}

  async ngOnInit(): Promise<void> {
    this.address = await this.metamaskService.getAddress();
    await this.loadTransactions();
  }

  async onSubmit() {
    try {
      await this.metamaskService.connect();

      this.fromAddress = await this.metamaskService.getAddress();
      const toAddress = this.toAddress;
      const amount = Number(this.amount);
      const nonce = await this.metamaskService.getNonce(this.fromAddress);

      const newTransaction = {
        to: toAddress,
        value: amount,
        nonce: Number(nonce),
        status: 'pending',
        errorMessage: '',
      };

      this.transactions.unshift(newTransaction); // add new transaction to beginning of array

      await this.metamaskService.sendTransaction(newTransaction); // send transaction

      newTransaction.status = 'success';

      this.toAddress = '';
      this.amount = 0;
    } catch (error: any) {
      console.error(error);

      // find most recent transaction in array and add error message
      const mostRecentTransaction = this.transactions[0];
      if (mostRecentTransaction) {
        mostRecentTransaction.status = 'failed';
        mostRecentTransaction.errorMessage = error.message;
      }
    } finally {
      await this.metamaskService.disconnect();
    }
  }

  async loadTransactions(): Promise<void> {
    try {
      const txs = await this.metamaskService.getTransactions();
      this.transactions = txs.map((tx: any) => {
        const date = new Date(parseInt(tx.timeStamp) * 1000);
        const coinType = this.selectedCoin;
        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          gasPrice: tx.gasPrice,
          gasUsed: tx.gasUsed,
          blockNumber: tx.blockNumber,
          date : date,
          coinType : coinType,
        };
      });
    } catch (error) {
      console.error(error);
    }
  }  
}
