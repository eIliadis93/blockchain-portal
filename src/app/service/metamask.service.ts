import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import Web3 from 'web3';

interface CustomWindow extends Window {
  ethereum?: any;
}

@Injectable({
  providedIn: 'root',
})
export class MetamaskService {
  private web3?: Web3;
  private readonly customWindow: CustomWindow;

  constructor() {
    this.customWindow = window as CustomWindow;
    if (this.customWindow.ethereum) {
      this.web3 = new Web3(this.customWindow.ethereum);
    } else {
      console.warn('Metamask not detected');
    }
  }

  // the log in method
  async connect() {
    try {
      await this.customWindow.ethereum.request({
        method: 'eth_requestAccounts',
      });
    } catch {
      throw new Error(
        'Please install metamask browser addon in order to continue!'
      );
    }
  }

  //checks if the user is connected
  async isConnected(): Promise<boolean> {
    return Boolean(this.customWindow.ethereum?.selectedAddress);
  }

  //searching for metamask address
  async getAddress(): Promise<string> {
    const accounts = await this.web3?.eth.getAccounts();
    if (accounts?.length) {
      return accounts[0];
    } else {
      throw new Error('Please Log In to continue!');
    }
  }

  async disconnect() {
    if (this.customWindow.ethereum) {
      await this.customWindow.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
      await this.customWindow.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
    }
  }

  isMetamaskInstalled(): boolean {
    return Boolean(this.customWindow.ethereum);
  }

  async getAccount(): Promise<string> {
    const account = await this.getAddress();
    return account;
  }

  //this method handles the flow if the user want to make a transaction
  async sendTransaction(transaction: {
    to: string;
    value: number;
    nonce: number;
  }) {
    const fromAddress = await this.getAccount();
    const gasPrice = await this.web3?.eth.getGasPrice();
    const gasLimit = 21000;
    const data = '';
    const nonce = transaction.nonce;

    const tx = {
      from: fromAddress,
      to: transaction.to,
      value: transaction.value,
      gasPrice,
      gasLimit,
      data,
      nonce,
    };

    const signedTx = await this.customWindow.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx],
    });

    return signedTx;
  }

  //Code for the tip button, the toAddress is my own metamask wallet address.
  async tip() {
    const fromAddress = await this.getAccount();
    const toAddress = '0x8aAA1F5f55654A812e9919f4653e363ab97419fB';
    const data = 'Tipping the Blockchain Portal Developer';
    const nonce = await this.getNonce(fromAddress);
    const value: any = this.web3?.utils.toWei('0.000005', 'ether');
    const gasLimit = 21000;

    // Prompt the user to confirm the transaction before submitting it
    const confirm = window.confirm(
      'You are going to make a transaction to tip the amount of 0.000005 ETH to the devs that created this web page. If you continue, you will have to set your gas fee in Wei. Are you sure you want to continue?'
    );

    if (confirm) {
      // Prompt the user to enter the gas price they want to use
      const gasPrice = prompt('Enter gas price (in wei)');

      const tx = {
        from: fromAddress,
        to: toAddress,
        value: value,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        data: data,
        nonce: nonce,
      };

      const signedTx = await this.customWindow.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
      });

      return signedTx;
    } else {
      window.alert('Transaction cancelled.');
    }
  }

  // this fuction needs to claim an API key, since there is some cost and wait time for this, it will be impemented in the future
  async getTransactions(): Promise<any[]> {
    const address = await this.getAddress();
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=<YOUR_API_KEY>`;
    const response = await fetch(url);
    const json = await response.json();
    if (json.status === '1') {
      return json.result;
    } else {
      throw new Error('Error fetching transactions');
    }
  }

  async getNonce(fromAddress: string): Promise<number> {
    const nonce: any = await this.web3?.eth.getTransactionCount(
      fromAddress,
      'pending'
    );
    return nonce;
  }
}
