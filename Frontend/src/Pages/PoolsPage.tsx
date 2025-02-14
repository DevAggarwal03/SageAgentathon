import { useState, useMemo } from 'react';
import { pools } from '../poolsList';
import Navbar from '../Components/Navbar';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAccount } from 'wagmi';

const PoolsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPool, setExpandedPool] = useState<string | null>(null);
  const { isConnected } = useAccount();
  
  // State for swap inputs
  interface SwapState {
    [poolId: string]: {
      fromAmount: string;
      toAmount: string;
      isReversed: boolean;
    };
  }
  
  const [swapStates, setSwapStates] = useState<SwapState>({});

  // Filter pools based on search query
  const filteredPools = useMemo(() => {
    return pools.filter(pool => 
      pool.token0.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.token1.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const formatFee = (fee: number): string => {
    return (fee / 10000).toFixed(2) + '%';
  };

  const handleExpandPool = (poolId: string) => {
    setExpandedPool(expandedPool === poolId ? null : poolId);
    // Initialize swap state for this pool if it doesn't exist
    if (!swapStates[poolId]) {
      setSwapStates(prev => ({
        ...prev,
        [poolId]: {
          fromAmount: '',
          toAmount: '',
          isReversed: false
        }
      }));
    }
  };

  const handleSwapInputChange = (poolId: string, value: string) => {
    setSwapStates(prev => ({
      ...prev,
      [poolId]: {
        ...prev[poolId],
        fromAmount: value,
        toAmount: value // This should be calculated based on pool rate
      }
    }));
  };

  const handleReverseTokens = (poolId: string) => {
    setSwapStates(prev => ({
      ...prev,
      [poolId]: {
        ...prev[poolId],
        isReversed: !prev[poolId]?.isReversed,
        fromAmount: prev[poolId]?.toAmount || '',
        toAmount: prev[poolId]?.fromAmount || ''
      }
    }));
  };

  return (
    <div className='flex flex-col'>
    <Navbar/>
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-8">Liquidity Pools</h1>

        {/* Search and Network Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="Search by token or address..."
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

        {/* Pools List */}
        <div className="space-y-4">
          {filteredPools.map((pool) => {
            const swapState = swapStates[pool.id] || { fromAmount: '', toAmount: '', isReversed: false };
            const { fromAmount, toAmount, isReversed } = swapState;
            const fromToken = isReversed ? pool.token1 : pool.token0;
            const toToken = isReversed ? pool.token0 : pool.token1;

            return (
              <div 
                key={pool.id}
                className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Token Pair Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={pool.token0.logoURI}
                        alt={pool.token0.symbol}
                        className="w-10 h-10 rounded-full"
                      />
                      <img 
                        src={pool.token1.logoURI}
                        alt={pool.token1.symbol}
                        className="w-10 h-10 rounded-full absolute -bottom-2 -right-2"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {pool.token0.symbol}/{pool.token1.symbol}
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">{pool.source}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-blue-400">{formatFee(pool.fee)} fee</span>
                      </div>
                    </div>
                  </div>

                  {/* Pool Details */}
                  <div className="flex flex-col md:flex-row gap-6 md:items-center">
                    {/* Token 0 Info */}
                    <div className="text-sm">
                      <div className="text-gray-400 mb-1">{pool.token0.symbol}</div>
                      <a 
                        href={`https://basescan.org/token/${pool.token0.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {pool.token0.address.slice(0, 6)}...{pool.token0.address.slice(-4)}
                      </a>
                    </div>

                    {/* Token 1 Info */}
                    <div className="text-sm">
                      <div className="text-gray-400 mb-1">{pool.token1.symbol}</div>
                      <a 
                        href={`https://basescan.org/token/${pool.token1.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {pool.token1.address.slice(0, 6)}...{pool.token1.address.slice(-4)}
                      </a>
                    </div>

                    {/* Pool Address */}
                    <div className="text-sm">
                      <div className="text-gray-400 mb-1">Pool Address</div>
                      <a 
                        href={`https://basescan.org/address/${pool.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {pool.address.slice(0, 6)}...{pool.address.slice(-4)}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Expand/Collapse button */}
                <button
                  onClick={() => handleExpandPool(pool.id.toString())}
                  className="mt-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                >
                  <span>{expandedPool === pool.id.toString() ? 'Hide' : 'Swap'}</span>
                  <ChevronDownIcon 
                    className={`w-4 h-4 transition-transform ${
                      expandedPool === pool.id.toString() ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Swap Interface */}
                {expandedPool === pool.id.toString() && (
                  <div className="mt-4 p-4 bg-gray-900 rounded-xl">
                    {/* From Token */}
                    <div className="bg-gray-800 p-4 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">From</span>
                        <span className="text-sm text-gray-400">Balance: 0.00</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={fromAmount}
                          onChange={(e) => handleSwapInputChange(pool.id.toString(), e.target.value)}
                          placeholder="0.0"
                          className="bg-transparent text-2xl outline-none flex-1"
                        />
                        <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-xl">
                          <img 
                            src={fromToken.logoURI} 
                            alt={fromToken.symbol}
                            className="w-6 h-6 rounded-full"
                          />
                          <span>{fromToken.symbol}</span>
                        </div>
                      </div>
                    </div>

                    {/* Swap Direction Button */}
                    <div className="flex justify-center -my-3 relative z-10">
                      <button
                        onClick={() => handleReverseTokens(pool.id.toString())}
                        className="bg-gray-700 p-2 rounded-xl hover:bg-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </button>
                    </div>

                    {/* To Token */}
                    <div className="bg-gray-800 p-4 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">To</span>
                        <span className="text-sm text-gray-400">Balance: 0.00</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={toAmount}
                          readOnly
                          placeholder="0.0"
                          className="bg-transparent text-2xl outline-none flex-1"
                        />
                        <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-xl">
                          <img 
                            src={toToken.logoURI} 
                            alt={toToken.symbol}
                            className="w-6 h-6 rounded-full"
                          />
                          <span>{toToken.symbol}</span>
                        </div>
                      </div>
                    </div>

                    {/* Swap Button */}
                    <button
                      disabled={!isConnected || !fromAmount}
                      className={`w-full mt-4 py-3 px-4 rounded-xl font-semibold ${
                        isConnected && fromAmount
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {!isConnected 
                        ? 'Connect Wallet'
                        : !fromAmount 
                          ? 'Enter Amount'
                          : 'Swap'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* No Results */}
          {filteredPools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No pools found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default PoolsPage;
