import { SeiClient } from '@sei-js/core';
import { config } from '../config';

export class DMeterSeiClient {
  private seiClient: SeiClient;

  constructor() {
    this.seiClient = new SeiClient({
      rpcUrl: config.seiRpcUrl,
      chainId: config.seiChainId
    });
  }

  async submitEnvironmentalData(data: EnvironmentalData): Promise<string> {
    try {
      const tx = await this.seiClient.signAndBroadcast({
        msgs: [{
          typeUrl: '/dmeter.environmental.v1.MsgSubmitData',
          value: {
            timestamp: Date.now(),
            dataType: data.dataType,
            location: data.location,
            value: data.value,
            reporter: data.reporter
          }
        }],
        memo: 'Environmental data submission via dMeter'
      });
      return tx.txHash;
    } catch (error) {
      console.error('Error submitting environmental data:', error);
      throw new Error('Failed to submit environmental data to Sei Network');
    }
  }

  async getEnvironmentalData(dataId: string): Promise<EnvironmentalData> {
    try {
      const response = await this.seiClient.query({
        path: '/dmeter.environmental.v1.Query/GetData',
        data: { id: dataId }
      });
      return response.data as EnvironmentalData;
    } catch (error) {
      console.error('Error fetching environmental data:', error);
      throw new Error('Failed to fetch environmental data from Sei Network');
    }
  }
}

export interface EnvironmentalData {
  dataType: string;
  location: string;
  value: number;
  reporter: string;
  timestamp?: number;
} 