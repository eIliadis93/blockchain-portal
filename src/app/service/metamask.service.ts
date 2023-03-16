import { Injectable } from '@angular/core';
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
    await this.customWindow.ethereum.request({ method: 'eth_requestAccounts' });
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
}
