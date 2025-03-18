import dotenv from 'dotenv';

dotenv.config();

export const config = {
  seiRpcUrl: process.env.SEI_RPC_URL || 'https://sei-rpc.example.com',
  seiChainId: process.env.SEI_CHAIN_ID || 'sei-chain-1',
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development'
}; 