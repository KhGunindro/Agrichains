import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (...args: any[]) => Promise<void>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

interface Web3ContextType {
  web3: Web3 | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  contract: any | null;
  account: string;
  role: string;
  isContractInitialized: boolean;
  isInitializing: boolean;
  isInitialized: boolean; // Add this
  error: string | null;
}

const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [account, setAccount] = useState<string>('');
  const [role, setRole] = useState<string>('guest');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isContractInitialized, setIsContractInitialized] = useState(false); // Add this
  const [error, setError] = useState<string | null>(null);

  const initializeContract = async (web3Instance: Web3) => {
    try {
      const response = await fetch('contracts/AgriSupplyChain.json');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch contract ABI: ${response.status} ${response.statusText}`);
      }
  
      const text = await response.text(); // Read as text to debug
      console.log('Contract JSON Response:', text);
  
      const contractJSON = JSON.parse(text); // Now parse JSON
      const networkId = await web3Instance.eth.net.getId();
  
      if (!contractJSON.networks[networkId.toString()]) {
        throw new Error(`Contract not deployed on network ${networkId}`);
      }
  
      const contractInstance = new web3Instance.eth.Contract(
        contractJSON.abi as AbiItem[],
        contractJSON.networks[networkId.toString()].address
      );
  
      setContract(contractInstance);
      setIsContractInitialized(true);
      return contractInstance;
    } catch (error) {
      console.error('Contract initialization failed:', error);
      setIsContractInitialized(false);
      throw error;
    }
  };
  
  const checkNetwork = async (web3Instance: Web3) => {
    try {
      const chainId = await web3Instance.eth.getChainId();
      if (Number(chainId) !== 1337) {
        throw new Error('Please connect to Ganache network (ID 1337)');
      }
    } catch (error) {
      console.error('Network check failed:', error);
      throw error;
    }
  };

  const initializeWeb3 = async () => {
    try {
      if (!window.ethereum) throw new Error('Web3 wallet not detected');
      
      const web3Instance = new Web3(window.ethereum);
      await checkNetwork(web3Instance);
      
      const accounts = await web3Instance.eth.getAccounts();
      const contractInstance = await initializeContract(web3Instance);

      setWeb3(web3Instance);
      setContract(contractInstance);
      setAccount(accounts[0] || '');
      if (accounts[0]) await checkUserRole(contractInstance, accounts[0]);
      setIsInitialized(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Initialization failed');
      setIsInitialized(true);
    } finally {
      setIsInitializing(false);
    }
  };

  const checkUserRole = async (contractInstance: any, accountAddress: string) => {
    try {
      // First check if the address is the owner
      const owner = await contractInstance.methods.Owner().call();
      
      if (owner.toLowerCase() === accountAddress.toLowerCase()) {
        setRole('owner');
        return;
      }
  
      // If not owner, check other roles
      const userRole = await contractInstance.methods.getUserRole(accountAddress).call();
      setRole(userRole);
      
      console.log('Role check results:', {
        address: accountAddress,
        owner,
        isOwner: owner.toLowerCase() === accountAddress.toLowerCase(),
        userRole
      });
    } catch (error) {
      console.error('Role check error:', error);
      setRole('guest');
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    setAccount(accounts[0] || '');
    if (contract && accounts[0]) checkUserRole(contract, accounts[0]);
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error('Web3 wallet not available');
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await initializeWeb3();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Connection failed');
      console.error('Wallet connection error:', error);
    }
  };

  const disconnectWallet = () => {
    setWeb3(null);
    setContract(null);
    setAccount('');
    setRole('guest');
    setError(null);
  };

  useEffect(() => {
    const init = async () => {
      await initializeWeb3();
      
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      }
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{
      web3,
      connectWallet,
      disconnectWallet,
      contract,
      account,
      role,
      isInitialized,
      isContractInitialized, // Provide this to components
      isInitializing,
      error
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};