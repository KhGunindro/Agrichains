import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';

interface Transaction {
  event: string;
  returnValues: {
    id?: string;
    farmer?: string;
    processor?: string;
    distributor?: string;
    retailer?: string;
    [key: string]: any;
  };
  blockNumber: number;
  transactionHash: string;
  eventName: string;
  participantRole?: string;
  participantName?: string;
}

const TransactionBadge = ({ type }: { type: string }) => {
  const variants: { [key: string]: string } = {
    ProductRegistered: 'bg-blue-100 text-blue-800',
    ProductPlanted: 'bg-green-100 text-green-800',
    ProductHarvested: 'bg-yellow-100 text-yellow-800',
    ProductProcessed: 'bg-purple-100 text-purple-800',
    ProductDistributed: 'bg-orange-100 text-orange-800',
    ProductReceived: 'bg-pink-100 text-pink-800',
    ProductSold: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <Badge className={`${variants[type] || 'bg-gray-100 text-gray-800'}`}>
      {type}
    </Badge>
  );
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard');
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
};

const Transactions = () => {
  const { web3, contract, isContractInitialized } = useWeb3();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const getBlockExplorerUrl = (chainId: number | null) => {
    switch (chainId) {
      case 1: return 'https://etherscan.io/tx/';
      case 3: return 'https://ropsten.etherscan.io/tx/';
      case 4: return 'https://rinkeby.etherscan.io/tx/';
      case 5: return 'https://goerli.etherscan.io/tx/';
      case 42: return 'https://kovan.etherscan.io/tx/';
      case 56: return 'https://bscscan.com/tx/';
      case 97: return 'https://testnet.bscscan.com/tx/';
      case 137: return 'https://polygonscan.com/tx/';
      case 80001: return 'https://mumbai.polygonscan.com/tx/';
      default: return 'https://etherscan.io/tx/';
    }
  };

  useEffect(() => {
    const fetchChainId = async () => {
      if (!web3) return;
      const id = Number(await web3.eth.getChainId());
      setChainId(id);
    };
    fetchChainId();
  }, [web3]);

  const getParticipantInfo = async (eventName: string, returnValues: any, contract: any) => {
    const roleMap: { [key: string]: { role: string; field: string } } = {
      ProductRegistered: { role: 'Farmer', field: 'farmer' },
      ProductPlanted: { role: 'Farmer', field: 'farmer' },
      ProductHarvested: { role: 'Farmer', field: 'farmer' },
      ProductProcessed: { role: 'Processor', field: 'processor' },
      ProductDistributed: { role: 'Distributor', field: 'distributor' },
      ProductReceived: { role: 'Retailer', field: 'retailer' },
      ProductSold: { role: 'Retailer', field: 'retailer' },
    };

    const { role, field } = roleMap[eventName] || {};
    const address = returnValues[field] || null;
    let name = 'N/A';

    if (address && contract) {
      try {
        let result;
        switch (role) {
          case 'Farmer':
            result = await contract.methods.getFarmer(address).call();
            break;
          case 'Processor':
            result = await contract.methods.getProcessor(address).call();
            break;
          case 'Distributor':
            result = await contract.methods.getDistributor(address).call();
            break;
          case 'Retailer':
            result = await contract.methods.getRetailer(address).call();
            break;
          default:
            result = null;
        }
        name = result?.name || 'Unknown';
      } catch (error) {
        console.error('Error fetching participant:', error);
      }
    }

    return { role, name };
  };

  const loadTransactions = async () => {
    if (!web3 || !contract || !isContractInitialized) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading transactions...');
      console.log('Contract status:', {
        web3: !!web3,
        contract: !!contract,
        isInitialized: isContractInitialized
      });

      const events = await contract.getPastEvents('allEvents', {
        fromBlock: 0,
        toBlock: 'latest'
      });

      console.log('Events received:', events);

      const formattedTxns = await Promise.all(events.map(async (event: any) => {
        const { role, name } = await getParticipantInfo(event.event, event.returnValues, contract);
        
        return {
          eventName: event.event,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
          returnValues: event.returnValues,
          participantRole: role,
          participantName: name,
        };
      }));

      console.log('Formatted transactions:', formattedTxns);
      setTransactions(formattedTxns.reverse());
      setError(null);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [web3, contract, isContractInitialized]);

  if (!isContractInitialized || !web3 || !contract) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Please connect your wallet to view transactions
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center p-6">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">Total Transactions</div>
            <div className="mt-2 text-3xl font-semibold">{transactions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">Latest Block</div>
            <div className="mt-2 text-3xl font-semibold">
              {transactions[0]?.blockNumber || 'N/A'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">Latest Activity</div>
            <div className="mt-2">
              {transactions[0] ? (
                <TransactionBadge type={transactions[0].eventName} />
              ) : (
                'No activity'
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Table */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadTransactions}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Block</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead>QR Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn, index) => {
                  const explorerUrl = `${getBlockExplorerUrl(chainId)}${txn.transactionHash}`;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <TransactionBadge type={txn.eventName} />
                      </TableCell>
                      <TableCell>{txn.returnValues?.id || 'N/A'}</TableCell>
                      <TableCell>{txn.participantRole || 'N/A'}</TableCell>
                      <TableCell>{txn.blockNumber}</TableCell>
                      <TableCell className="font-mono">
                        <div className="flex items-center gap-2">
                          <span>{`${txn.transactionHash.slice(0, 6)}...${txn.transactionHash.slice(-4)}`}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-gray-100"
                            onClick={() => copyToClipboard(txn.transactionHash)}
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy hash</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <QRCodeSVG 
                            value={explorerUrl}
                            size={50}
                            className="p-1 bg-white rounded hover:shadow-lg transition-shadow"
                          />
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;