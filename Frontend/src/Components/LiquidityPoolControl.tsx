import { Config, UseAccountReturnType, useWriteContract } from "wagmi";
import { publicClient } from "../Pages/LandingPage";
// import LpJson from '../Constants/LineaSepolia/LiquidityPool.json'
import LpJson from '../Constants/ArbitrumSepolia/LiquidityPool.json'
import ClkJson from '../Constants/ArbitrumSepolia/CLKToken.json'
import MirJson from '../Constants/ArbitrumSepolia/MIRToken.json'
import { useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";

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
    // const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    //     hash,
    // });

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
        <div className="flex flex-col w-full rounded-lg gap-y-2 bg-gray-300 p-3">

            <div className="flex w-full items-center justify-center gap-x-2">
                <div>Contract Address: </div>
                <input type="text" disabled value={contractAddress.slice(0, 5) + "..." + contractAddress.slice(-5)}/>
            </div>

            <div className="flex w-full flex-col gap-y-1">
                <div className="w-full flex justify-between rounded-lg gap-x-2">
                    <input onChange={changeInputClkToken} className="p-1 w-full rounded-lg" placeholder="Amount CLK" id="ClkPoolAmt" type="number" min={50}/>
                    <input onChange={changeInputMirToken} className="p-1 w-full rounded-lg" placeholder="Amount MIR" id="MirPoolAmt" type="number" min={50}/>
                </div>
                <button onClick={approve} className="bg-slate-400 p-1 rounded-md text-white text-xl">Approve Transfer</button>
                <button onClick={provideLiquidity} className="bg-slate-400 p-1 rounded-md text-white text-xl">Add Liquidity</button>
            </div>

            <div className="w-full flex flex-col gap-y-1">
                <input onChange={changeRemoveLiqAmt} id="removeLiquidity" className="p-1 rounded-lg" placeholder="Amount to Remove" type="number" min={50}/>
                <button onClick={removeLiquidity} className="bg-slate-400 p-1 rounded-md text-white text-xl">Remove Liquidity</button>
            </div>

            <div className="w-full flex gap-x-2">
                <div className="w-full flex flex-col gap-y-1">
                    <input id="ClkToMir" onChange={changeClkToSwap} className="p-1 rounded-lg" placeholder="Amount of CLK" type="number" min={50}/>
                    <button onClick={swapCLK} className="bg-slate-400 p-1 rounded-md text-white text-xl">Swap CLK</button>
                </div>
                <div className="w-full flex flex-col gap-y-1">
                    <input id="MirToClk" onChange={changeMirToSwap} className="p-1 rounded-lg" placeholder="Amount of MIR" type="number" min={50}/>
                    <button onClick={swapMIR} className="bg-slate-400 p-1 rounded-md text-white text-xl">Swap MIR</button>
                </div>
            </div>

            <div className="flex w-full items-center justify-center gap-x-2">
                <div>balance {symbol}: </div>
                <input type="text" disabled className="text-center" value={parseFloat(formatEther(balance)).toFixed(4) + " " + symbol}/>
            </div>

        </div>
     );
}
 
export default LiquidityPoolControl;