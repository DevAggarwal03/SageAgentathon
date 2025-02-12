import { Config, UseAccountReturnType, useWaitForTransactionReceipt } from "wagmi";
import { publicClient } from "../Pages/LandingPage";
import clkJson from '../Constants/ArbitrumSepolia/CLKToken.json'
import mirJson from '../Constants/ArbitrumSepolia/MIRToken.json'
import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { formatEther, parseEther } from "viem";
import { FaCoins, FaPaperPlane } from 'react-icons/fa';

const TokenMeasure = ({account, symbol}: {account: UseAccountReturnType<Config>, symbol: string}) => {
    const contractAddress = symbol === "CLK" ? clkJson.address : mirJson.address;
    const contractAbi = symbol === "CLK" ? clkJson.abi : mirJson.abi;

    const {writeContract, isPending, data: hash} = useWriteContract();
    const { isLoading } = useWaitForTransactionReceipt({ hash });

    const [balance, setBalance] = useState<any>(0)
    const [mintAmt, setMintAmt] = useState<number>(0)
    const [toAmt, setToAmt] = useState<number>(0)
    const [mintingIsClicked, setMintingIsClicked] = useState<boolean>(false);
    const [transferringIsClicked, setTransferringIsClicked] = useState<boolean>(false);
    const [toAddress, setToAddress] = useState<string>("")

    useEffect(() => {getBalance()}, [isPending, isLoading])
    useEffect(() => {
        if(isLoading === false && mintingIsClicked === true){
            setMintingIsClicked(false);
        }
    },[isLoading])
    useEffect(() => {
        if(isLoading === false && transferringIsClicked === true){
            setTransferringIsClicked(false);
        }
    },[isLoading])

    const getBalance = async() => {
        const data = await publicClient.readContract({
            address: `0x${contractAddress.slice(2)}`,
            abi: contractAbi,
            args: [account.address],
            functionName: "balanceOf"
        })
        setBalance(data);
    }

    const mintToken = async() => {  
        setMintingIsClicked(true)
        try {
            await writeContract({
                abi: contractAbi,
                address: `0x${contractAddress.slice(2)}`,
                args: [parseEther(mintAmt.toString())],
                functionName: "mint",
                account: account.address
            })
        } catch (error) {
            console.error(error)
            setMintingIsClicked(false)
        }
    }

    const transferTokens = async() => {
        setTransferringIsClicked(true)
        try {
            await writeContract({
                address: `0x${contractAddress.slice(2)}`,
                abi: contractAbi,
                functionName: "transfer",
                args: [toAddress, parseEther(toAmt.toString())]
            })
        } catch (error) {
            console.error(error)
            setTransferringIsClicked(false)
        }
    }

    return ( 
        <div className="flex flex-col w-full max-w-2xl mx-auto rounded-xl gap-y-4 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl">
            {/* Contract Info */}
            <div className="flex items-center justify-between bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2">
                    <FaCoins className="text-yellow-400" />
                    <h2 className="text-xl font-bold text-white">{symbol} Token</h2>
                </div>
                <code className="bg-slate-800 px-3 py-1 rounded-md text-blue-400 font-mono">
                    {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                </code>
            </div>

            {/* Balance Display */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-700/30 rounded-xl">
                <span className="text-gray-300">Balance:</span>
                <span className="text-xl font-semibold text-white">
                    {parseFloat(formatEther(balance)).toFixed(4)} {symbol}
                </span>
            </div>

            {/* Mint Section */}
            <div className="bg-slate-700/30 rounded-xl p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                    <FaCoins className="text-yellow-400" /> Mint Tokens
                </h3>
                <div className="flex gap-2">
                    <input
                        value={mintAmt}
                        onChange={(e) => setMintAmt(Number(e.target.value))}
                        className="flex-1 p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 
                                 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Amount to mint"
                        type="number"
                        min={50}
                    />
                    <button
                        onClick={mintToken}
                        disabled={isPending || isLoading}
                        className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white 
                                 font-semibold transition-all duration-200 disabled:bg-gray-600 
                                 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        {(isPending || isLoading) && mintingIsClicked ? "Minting..." : "Mint"}
                    </button>
                </div>
            </div>

            {/* Transfer Section */}
            <div className="bg-slate-700/30 rounded-xl p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                    <FaPaperPlane className="text-blue-400" /> Transfer Tokens
                </h3>
                <input
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 
                             focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Recipient address"
                    type="text"
                />
                <div className="flex gap-2">
                    <input
                        value={toAmt}
                        onChange={(e) => setToAmt(Number(e.target.value))}
                        className="flex-1 p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 
                                 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Amount to transfer"
                        type="number"
                        min={50}
                    />
                    <button
                        onClick={transferTokens}
                        disabled={isPending || isLoading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white 
                                 font-semibold transition-all duration-200 disabled:bg-gray-600 
                                 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        {(isPending || isLoading) && transferringIsClicked ? "Transferring..." : "Transfer"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TokenMeasure;