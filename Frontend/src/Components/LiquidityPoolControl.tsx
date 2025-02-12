import { Config, UseAccountReturnType, useWriteContract } from "wagmi";
import { publicClient } from "../Pages/LandingPage";
// import LpJson from '../Constants/LineaSepolia/LiquidityPool.json'
import LpJson from '../Constants/ArbitrumSepolia/LiquidityPool.json'
import ClkJson from '../Constants/ArbitrumSepolia/CLKToken.json'
import MirJson from '../Constants/ArbitrumSepolia/MIRToken.json'
import { useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";
import { FaExchangeAlt, FaCoins } from 'react-icons/fa';

const LiquidityPoolControl = ({account, symbol}: {account: UseAccountReturnType<Config>, symbol: string}) => {
    const contractAddress = LpJson.address 
    const contractAbi = LpJson.abi;
    const [InputClkToken, setInputClkToken] = useState<number>(0)
    const [InputMirToken, setInputMirToken] = useState<number>(0)
    const [balance, setBalance] = useState<any>(0)
    const [clkToSwap, setClkToSwap] = useState<number>(0);
    const [mirToSwap, setMirToSwap] = useState<number>(0);

    const [removeLiqAmt, setRemoveLiqAmt] = useState<number>(0);

    const {writeContract} = useWriteContract();

    useEffect(() => {getBalance()}, [])

    const getBalance = async() => {
        const data = await publicClient.readContract({
            address: `0x${contractAddress.slice(2)}`,
            abi: contractAbi,
            args: [account.address],
            functionName: "balanceOf"
        })
        setBalance(data);
    }

    const changeInputClkToken = async(e:any) => {
        setInputClkToken(e.target.value);
    }
    const changeInputMirToken = async(e:any) => {
        setInputMirToken(e.target.value)
    }

    const approve = async() => {
        try {
            console.log(InputClkToken, InputMirToken)
            const approveClk = await writeContract({
                abi: ClkJson.abi,
                address: `0x${ClkJson.address.slice(2)}`,
                functionName: 'approve',
                args: [contractAddress, parseEther(InputClkToken.toString())]
            })
            const approveMir = await writeContract({
                abi: MirJson.abi,
                address: `0x${MirJson.address.slice(2)}`,
                functionName: 'approve',
                args: [contractAddress, parseEther(InputMirToken.toString())]
            })
            console.log(approveClk, approveMir)
        } catch (error) {
            console.log(error)
        }
    }

    const provideLiquidity = async() => {
        try {
            if(InputClkToken !== 0 && InputMirToken !== 0){
                const res = await writeContract({
                    abi: contractAbi,
                    address: `0x${contractAddress.slice(2)}`,
                    functionName: "addLiquidity",
                    args: [parseEther(InputClkToken.toString()), parseEther(InputMirToken.toString())]
                })
                console.log(res)
            }else{
                console.log("no liquidity Provided");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const changeRemoveLiqAmt = (e:any) => {
        setRemoveLiqAmt(e.target.value)
    }

    const removeLiquidity = async() => {
        try {
            console.log(`removing liquidity`)
            const res = await writeContract({
                abi: contractAbi,
                address: `0x${contractAddress.slice(2)}`,
                functionName: `removeLiquidity`,
                args: [parseEther(removeLiqAmt.toString())]
            })
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const changeClkToSwap = (e:any) => {
        setClkToSwap(e.target.value)
    }

    const changeMirToSwap = (e:any) => {
        setMirToSwap(e.target.value)
    }

    const swapCLK = async() => {
        try {
            const res = await writeContract({
                abi: contractAbi,
                address: `0x${contractAddress.slice(2)}`,
                functionName: 'swapAtoB',
                args: [parseEther(clkToSwap.toString())]
            })
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const swapMIR = async() => {
        try {
            const res = await writeContract({
                abi: contractAbi,
                address: `0x${contractAddress.slice(2)}`,
                functionName: 'swapBtoA',
                args: [parseEther(mirToSwap.toString())]
            })
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }


    return ( 
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-white">{symbol} Token</h2>
                    <div className="px-3 py-1 bg-gray-700/50 rounded-lg">
                        <code className="text-sm text-blue-400 font-mono">
                            {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                        </code>
                    </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-700/30 rounded-xl">
                    <span className="text-gray-400">Balance:</span>
                    <span className="text-xl font-semibold text-white">{parseFloat(formatEther(balance)).toFixed(4)} {symbol}</span>
                </div>
            </div>

            {/* Add Liquidity Section */}
            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-lg text-white mb-2">
                    <FaCoins className="text-yellow-500" />
                    <h3 className="font-semibold">Add Liquidity</h3>
                </div>
                <div className="flex gap-2">
                    <input
                        onChange={changeInputClkToken}
                        className="flex-1 px-4 py-3 bg-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Amount CLK"
                        type="number"
                        min={50}
                    />
                    <input
                        onChange={changeInputMirToken}
                        className="flex-1 px-4 py-3 bg-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Amount MIR"
                        type="number"
                        min={50}
                    />
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={approve}
                        className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        Approve Transfer
                    </button>
                    <button 
                        onClick={provideLiquidity}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        Add Liquidity
                    </button>
                </div>
            </div>

            {/* Remove Liquidity Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg text-white mb-2">
                    <FaCoins className="text-red-500" />
                    <h3 className="font-semibold">Remove Liquidity</h3>
                </div>
                <input
                    onChange={changeRemoveLiqAmt}
                    className="w-full px-4 py-3 bg-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Amount to Remove"
                    type="number"
                    min={50}
                />
                <button 
                    onClick={removeLiquidity}
                    className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-lg text-white font-semibold transition-colors"
                >
                    Remove Liquidity
                </button>
            </div>

            {/* Swap Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg text-white mb-2">
                    <FaExchangeAlt className="text-purple-500" />
                    <h3 className="font-semibold">Swap Tokens</h3>
                </div>
                <div className="flex gap-x-4">
                    <div className="flex-1 space-y-2">
                        <input
                            onChange={changeClkToSwap}
                            className="w-full px-4 py-3 bg-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Amount of CLK"
                            type="number"
                            min={50}
                        />
                        <button 
                            onClick={swapCLK}
                            className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-white font-semibold transition-colors"
                        >
                            Swap CLK
                        </button>
                    </div>
                    <div className="flex-1 space-y-2">
                        <input
                            onChange={changeMirToSwap}
                            className="w-full px-4 py-3 bg-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Amount of MIR"
                            type="number"
                            min={50}
                        />
                        <button 
                            onClick={swapMIR}
                            className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-white font-semibold transition-colors"
                        >
                            Swap MIR
                        </button>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default LiquidityPoolControl;