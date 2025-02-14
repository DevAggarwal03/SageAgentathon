import { useState, useMemo, useEffect } from 'react';
import { Token, tokens } from '../tokensList';
import { useAccount, useReadContracts } from 'wagmi';
import { erc20Abi } from 'viem';
import { formatUnits } from 'viem';
import Navbar from '../Components/Navbar';

const TokensPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { address: userAddress, isConnected } = useAccount();
  const [tokenBalances, setTokenBalances] = useState<{ [key: string]: string }>({});

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    return tokens.filter(token => 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Prepare contracts array for useReadContracts
  const contractsToRead = tokens
    .map(token => ({
      address: token.address as `0x${string}`,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [userAddress as `0x${string}`],
    }));

  // Fetch all ERC20 balances in one call
  const { data: balancesData } = useReadContracts({
    contracts: contractsToRead,
    query: {
      enabled: Boolean(isConnected && userAddress),
    },
  });

  // Update balances when data changes
  useEffect(() => {
    if (!isConnected || !userAddress) {
      setTokenBalances({});
      return;
    }

    const newBalances: { [key: string]: string } = {};

    // Set ERC20 balances
    balancesData?.forEach((balance, index) => {
      const token = tokens[index];
      if (balance.status === 'success' && token) {
        newBalances[token.address] = formatUnits(balance.result as bigint, token.decimals);
      } else {
        if (token) {
          newBalances[token.address] = '0.0';
        }
      }
    });

    setTokenBalances(newBalances);
  }, [balancesData, isConnected, userAddress]);

  const getFormattedBalance = (token: Token): string => {
    const balance = tokenBalances[token.address];
    if (!balance) return '0.0';
    
    // Format to max 6 decimal places and handle scientific notation
    const number = parseFloat(balance);
    if (number < 0.000001 && number > 0) {
      return '< 0.000001';
    }
    const formatted = number.toFixed(6);
    // Remove trailing zeros after decimal
    return formatted.replace(/\.?0+$/, '');
  };

  return (
    <div>
    <Navbar/>
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Tokens</h1>
        
        {/* Search and Network Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Base Network</span>
          </div>
        </div>

        {/* Tokens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTokens.map((token) => (
            <div 
              key={token.address}
              className="bg-gray-800 rounded-2xl p-4 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={token.logoURI} 
                    alt={token.name}
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'https://placehold.co/48x48?text=?';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{token.symbol}</h3>
                    <p className="text-gray-400 text-sm">{token.name}</p>
                  </div>
                </div>
                {isConnected && (
                  <div className="text-right">
                    <p className="font-medium">{getFormattedBalance(token)}</p>
                    <p className="text-gray-400 text-sm">Balance</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Contract</span>
                  <a 
                    href={`https://arbiscan.io/token/${token.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {token.address.slice(0, 6)}...{token.address.slice(-4)}
                  </a>
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>Decimals</span>
                  <span>{token.decimals}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTokens.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No tokens found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default TokensPage;
