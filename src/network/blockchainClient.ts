export interface Transaction {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface BlockchainClient {
  submitTransaction(
    module: string,
    action: string,
    params: any[]
  ): Promise<Transaction>;
  
  getTransactionStatus(hash: string): Promise<Transaction['status']>;
  
  getAccountBalance(address: string): Promise<number>;
} 