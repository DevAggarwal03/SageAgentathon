import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { CogIcon } from "@heroicons/react/24/outline";
import { Token, tokens } from "../tokensList";
import { useAccount, useReadContracts, useSendTransaction } from 'wagmi';
import { erc20Abi, parseEther } from "viem";
import { formatUnits } from "viem";
import axios from 'axios';

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  selectedToken?: Token;
}

interface TokenPrices {
  tokenPrice1: number;
  tokenPrice2: number;
  ratio: number;
}

const SwapPage = () => {
  const [isFromTokenModalOpen, setIsFromTokenModalOpen] = useState<boolean>(false);
  const [isToTokenModalOpen, setIsToTokenModalOpen] = useState<boolean>(false);
  const [fromToken, setFromToken] = useState<Token | undefined>(undefined);
  const [toToken, setToToken] = useState<Token | undefined>(undefined);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<string>("0.5");
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<string>("");
  const [fetchingAllowance, setFetchingAllowance] = useState<boolean>(false);
  const { address: userAddress, isConnected } = useAccount();
  const [tokenBalances, setTokenBalances] = useState<{ [key: string]: string }>({});
  const [txDetail, setTxDetail] = useState<{
    to: string,
    data: string,
    value: string,
    gasPrice?: bigint,
    gas?: string,
    from?: string
  } | null>(null);
  const {sendTransaction} = useSendTransaction();
  
  const [, setIsSwapping] = useState<boolean>(false);
  
  
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
    if (!isConnected || !userAddress) return;

    const newBalances: { [key: string]: string } = {};

    // Set ERC20 balances
    balancesData?.forEach((balance, index) => {
      const token = tokens[index ]; 
      if (balance.status === 'success' && token) {
        newBalances[token.address] = formatUnits(balance.result as bigint, token.decimals);
      } else {
        if(!token) return;
        newBalances[token.address] = '0.0';
      }
    });

    setTokenBalances(newBalances);
  }, [balancesData, isConnected, userAddress]);

  const [prices, setPrices] = useState<TokenPrices | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrices = async (token1Address: string, token2Address: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/tokenPrice`, {
        params: {
          address1: token1Address,
          address2: token2Address
        }
      });
      setPrices(response.data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update prices when tokens change
  useEffect(() => {
    if (fromToken && toToken) {
      fetchPrices(fromToken.address, toToken.address);
    }
  }, [fromToken?.address, toToken?.address]);

  // Calculate output amount when input or prices change
  useEffect(() => {
    if (fromAmount && prices?.ratio) {
      const calculatedAmount = fromAmount * prices.ratio;
      setToAmount(calculatedAmount.toFixed(6));
    } else {
      setToAmount('');
    }
  }, [fromAmount, prices?.ratio]);

  const TokenSelectModal: React.FC<TokenSelectModalProps> = ({ isOpen, onClose, onSelect, selectedToken }) => {
    if (!isOpen) return null;
  
    const getFormattedBalance = (token: Token): string => {
      const balance = tokenBalances[token.address];
      if (!balance) return '0.0';
      
      // Format to max 6 decimal places
      const formatted = parseFloat(balance).toFixed(6);
      // Remove trailing zeros after decimal
      return formatted.replace(/\.?0+$/, '');
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-800 rounded-3xl p-4 w-[400px] max-h-[600px] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Select Token</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Search token name or paste address"
            className="w-full p-3 bg-gray-700 rounded-xl mb-4 text-white outline-none"
          />
  
          <div className="space-y-2">
            {tokens.map((token) => (
              <button
                key={token.address}
                onClick={() => {
                  onSelect({
                    ...token,
                    balance: getFormattedBalance(token)
                  });
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-700 ${
                  selectedToken?.address === token.address ? 'bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={token.logoURI} alt={token.name} className="w-8 h-8 rounded-full" />
                  <div className="text-left">
                    <div className="text-white font-semibold">{token.symbol}</div>
                    <div className="text-gray-400 text-sm">{token.name}</div>
                  </div>
                </div>
                <div className="text-gray-400">
                  {isConnected ? getFormattedBalance(token) : '—'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleFromAmountChange = (value: number) => {
    setFromAmount(value);
    if (prices?.ratio) {
      const calculatedAmount = value * prices.ratio;
      setToAmount(calculatedAmount.toFixed(6));
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToAmount(e.target.value);
    // Add price calculation logic here
  };

  const getAllowance = async (tokenAddress: string | undefined) => {
    if(!tokenAddress) return;
    try {
      const allowance = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/1inch/allowance`,
        {
          params: {
            tokenAddress: tokenAddress,
            walletAddress: userAddress
          }
        }
      );
      return allowance.data;
    } catch (error) {
      console.error('Error fetching allowance:', error);
    }
  }

  const handleSwap = async () => {
    // Add swap logic here
    console.log('Swapping tokens...');

    if(!isConnected) {
      console.log('Connecting wallet...');
      alert('Please connect your wallet to swap tokens');
      return;
    }

    //see allowance
    setFetchingAllowance(true);
    const allowance = await getAllowance(fromToken?.address);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Allowance:', allowance['allowance']);
    console.log('From amount:', fromAmount);
    if(fromAmount === 0) {
      alert('Please enter an amount to swap');
      return;
    }
    if(allowance['allowance'] < fromAmount.toString().padEnd((fromToken?.decimals !== undefined ? fromToken?.decimals : 18) + fromAmount.toString().length, '0')) {
        try {
            console.log('fromAmount:', fromAmount.toString().padEnd((fromToken?.decimals !== undefined ? fromToken?.decimals : 18) + fromAmount.toString().length, '0'));
            const approveAmount = await axios.get(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/1inch/approve`,
                {
                    params: {
                        tokenAddress: fromToken?.address,
                        amount: fromAmount.toString().padEnd((fromToken?.decimals !== undefined ? fromToken?.decimals : 18) + fromAmount.toString().length, '0')
                    }
                }
            );
            console.log('Approve details:', approveAmount);
            setTxDetail({
                to: approveAmount.data.to,
                data: approveAmount.data.data,
                value: approveAmount.data.value
            });
            setFetchingAllowance(false);
            console.log('txDetail:', txDetail);
            console.log('Sending transaction...');
            const transaction = await sendTransaction({
                to: `0x${approveAmount.data?.to.slice(2)}`,
                data: `0x${approveAmount.data?.data.slice(2)}`,
                value: parseEther(approveAmount.data?.value as string),
                gasPrice: approveAmount.data?.gasPrice
            });
            console.log('Transaction sent:', transaction);
            return;

        } catch (error) {
            console.error('Error approving token:', error);
        }
    }
    setFetchingAllowance(false);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSwapping(true);

    try {
      const swap = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/1inch/swap`, {
        params: {
          fromToken: fromToken?.address,
          toToken: toToken?.address,
          amount: fromAmount.toString().padEnd(fromToken?.decimals || 18 + fromAmount.toString().length, '0'),
          walletAddress: userAddress,
          slippage: slippage
        }
      });
      setTxDetail({
        to: swap.data.tx.to,
        data: swap.data.tx.data,
        gasPrice: swap.data.tx.gasPrice,
        gas: swap.data.tx.gas,
        from: swap.data.tx.from,
        value: swap.data.tx.value
      });
      console.log(swap.data)
      await sendTransaction({
        to: `0x${swap.data.tx?.to.slice(2)}`,
        data: `0x${swap.data.tx?.data.slice(2)}`,
        value: parseEther(swap.data.tx?.value as string),
        gasPrice: swap.data.tx?.gasPrice,
      });
    } catch (error) {
      console.error('Error swapping tokens:', error);
    }
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-lg mx-auto">
            {/* Swap Container */}
            <div className="bg-gray-800 rounded-3xl p-6">
            <div className="flex justify-between mb-4 items-center">
              <h1 className="text-4xl font-bold">Swap</h1>
              <div className="relative">
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <CogIcon className="h-6 w-6 text-gray-400" />
                </button>

                {/* Settings Dialog */}
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-xl p-4 shadow-lg z-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-white font-semibold">Settings</h3>
                      <button 
                        onClick={() => setShowSettings(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm text-gray-400">Slippage Tolerance</div>
                      <div className="flex gap-2">
                        {['0.5', '1.0', '1.5'].map((value) => (
                          <button
                            key={value}
                            onClick={() => setSlippage(value)}
                            className={`px-4 py-2 rounded-lg ${
                              slippage === value 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {value}%
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={slippage}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlippage(e.target.value)}
                          className="w-24 px-3 py-2 bg-gray-700 rounded-lg text-white outline-none"
                          placeholder="Custom"
                        />
                        <span className="text-gray-400">%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </div>

            <div className="flex flex-col relative gap-y-2">
            
              {/* From Token */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">From</span>
                  <span className="text-gray-400">Balance: {fromToken?.balance || '0.0'}</span>
                </div>
                <div className="bg-gray-700 rounded-2xl p-4">
                  <div className="flex justify-between">
                    <input
                      type="number"
                      placeholder="0.0"
                      className="bg-transparent text-2xl text-white outline-none w-[200px]"
                      value={fromAmount}
                      onChange={(e) => handleFromAmountChange(parseInt(e.target.value))}
                    />
                    <button
                      onClick={() => setIsFromTokenModalOpen(true)}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-2xl"
                    >
                      {fromToken ? (
                        <>
                          <img src={fromToken.logoURI} alt={fromToken.name} className="w-6 h-6 rounded-full" />
                          <span className="text-white font-semibold">{fromToken.symbol}</span>
                        </>
                      ) : (
                        <span className="text-white">Select Token</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Swap Direction Arrow */}
              <div className="flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center">
                <button 
                  onClick={() => {
                    const temp = fromToken;
                    setFromToken(toToken);
                    setToToken(temp);
                  }}
                  className="bg-none p-2 px-3 rounded-xl hover:bg-gray-600"
                >
                  ↓
                </button>
              </div>

              {/* Price Information
              {prices && (
                <div className="price-info text-sm text-gray-400 px-4 py-2">
                  <div>1 {fromToken?.symbol} = {prices.ratio.toFixed(6)} {toToken?.symbol}</div>
                  <div>1 {toToken?.symbol} = {(1 / prices.ratio).toFixed(6)} {fromToken?.symbol}</div>
                </div>
              )} */}

              {/* To Token */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">To</span>
                  <span className="text-gray-400">Balance: {toToken?.balance || '0.0'}</span>
                </div>
                <div className="bg-gray-700 rounded-2xl p-4">
                  <div className="flex justify-between">
                    <input
                      type="number"
                      placeholder="0.0"
                      className="bg-transparent text-2xl text-white outline-none w-[200px]"
                      value={toAmount}
                      onChange={handleToAmountChange}
                      readOnly
                    />
                    <button
                      onClick={() => setIsToTokenModalOpen(true)}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-2xl"
                    >
                      {toToken ? (
                        <>
                          <img src={toToken.logoURI} alt={toToken.name} className="w-6 h-6 rounded-full" />
                          <span className="text-white font-semibold">{toToken.symbol}</span>
                        </>
                      ) : (
                        <span className="text-white">Select Token</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="loading-indicator">
                  Loading prices...
                </div>
              )}

              {/* Swap Button */}
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-2xl"
                disabled={!fromToken || !toToken}
                onClick={handleSwap}
              >
                {fetchingAllowance ? 'Fetching allowance...' : (!fromToken || !toToken ? 'Select tokens' : isConnected? 'Swap' : "connect wallet")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Token Select Modals */}
      <TokenSelectModal
        isOpen={isFromTokenModalOpen}
        onClose={() => setIsFromTokenModalOpen(false)}
        onSelect={setFromToken}
        selectedToken={fromToken}
      />
      <TokenSelectModal
        isOpen={isToTokenModalOpen}
        onClose={() => setIsToTokenModalOpen(false)}
        onSelect={setToToken}
        selectedToken={toToken}
      />
    </>
  );
};

export default SwapPage;



