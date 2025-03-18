import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42] // Add your supported chain IDs
});

export const useBlockchain = () => {
  const { account, activate, deactivate } = useWeb3React();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  useEffect(() => {
    if (provider && account) {
      const signer = provider.getSigner();
      setSigner(signer);
    }
  }, [provider, account]);

  const connect = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  };

  const disconnect = () => {
    try {
      deactivate();
    } catch (error) {
      console.error('Failed to disconnect:', error);
      throw error;
    }
  };

  const submitEnvironmentalData = async (
    dataType: string,
    location: string,
    value: number
  ) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    try {
      // Implementation for submitting environmental data
      // This would interact with your smart contract
      console.log('Submitting environmental data:', { dataType, location, value });
    } catch (error) {
      console.error('Failed to submit environmental data:', error);
      throw error;
    }
  };

  const getEnvironmentalData = async (dataId: string) => {
    if (!provider) {
      throw new Error('Provider not initialized');
    }

    try {
      // Implementation for fetching environmental data
      // This would interact with your smart contract
      console.log('Fetching environmental data for ID:', dataId);
    } catch (error) {
      console.error('Failed to fetch environmental data:', error);
      throw error;
    }
  };

  return {
    account,
    provider,
    signer,
    connect,
    disconnect,
    submitEnvironmentalData,
    getEnvironmentalData
  };
}; 