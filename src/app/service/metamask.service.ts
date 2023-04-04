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

  async isConnected(): Promise<boolean> {
    return Boolean(this.customWindow.ethereum?.selectedAddress);
  }

  async getAddress(): Promise<string> {
    const accounts = await this.web3?.eth.getAccounts();
    if (accounts?.length) {
      return accounts[0];
    } else {
      throw new Error('No accounts found');
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

  async sendTransaction(transaction: { to: string, value: number, nonce: number }) {
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

  async getTransactions(): Promise<any[]> {
    const address = await this.getAddress();
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=<YOUR_API_KEY>`;
    const response = await fetch(url);
    const json = await response.json();
    if (json.status === "1") {
      return json.result;
    } else {
      throw new Error("Error fetching transactions");
    }
  }
  
  async getNonce(fromAddress: string): Promise<number> {
    const nonce : any = await this.web3?.eth.getTransactionCount(fromAddress, 'pending');
    return nonce;
  }
}

