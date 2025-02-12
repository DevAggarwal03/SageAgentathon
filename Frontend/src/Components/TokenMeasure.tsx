import { Config, UseAccountReturnType, useWaitForTransactionReceipt } from "wagmi";
import { publicClient } from "../Pages/LandingPage";
// import clkJson from '../Constants/LineaSepolia/CLKToken.json'
// import mirJson from '../Constants/LineaSepolia/MIRToken.json'
import clkJson from '../Constants/ArbitrumSepolia/CLKToken.json'
import mirJson from '../Constants/ArbitrumSepolia/MIRToken.json'
import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { formatEther, parseEther } from "viem";

const TokenMeasure = ({account, symbol}: {account: UseAccountReturnType<Config>, symbol: string}) => {
    const contractAddress = symbol === "CLK" ? clkJson.address : mirJson.address;
    const contractAbi = symbol === "CLK" ? clkJson.abi : mirJson.abi;

    const {writeContract, isPending, data: hash} = useWriteContract();
    const { isLoading } = useWaitForTransactionReceipt({
        hash,
      });

    const [balance, setBalance] = useState<any>(0)
    const [mintAmt, setMintAmt] = useState<number>(0)
    const [toAmt, setToAmt] = useState<number>(0)
    const [mintingIsClicked, setMintingIsClicked] = useState<boolean>(false);
    const [transferringIsClicked, setTransferringIsClicked] = useState<boolean>(false);
    const [toAddress, setToAddress] = useState<string>("")

    const changeMintAmt = (e: any) => {
        setMintAmt(e.target.value);
    }
    const changeToAmt = (e: any) => {
        setToAmt(e.target.value);
    }
    const changeToAddress = (e: any) => {
        setToAddress(e.target.value);
    }

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
            const res = await writeContract({
                abi: contractAbi,
                address: `0x${contractAddress.slice(2)}`,
                args: [parseEther(mintAmt.toString())],
                functionName: "mint",
                account: `0x${account.address?.slice(2)}`
            })
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const transferTokens = async() => {
        setTransferringIsClicked(true)
        try {
            const res = await writeContract({
                address: `0x${contractAddress.slice(2)}`,
                abi: contractAbi,
                functionName: "transfer",
                args: [toAddress, parseEther(toAmt.toString())]
            })
            console.log(res);
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
            <div className="w-full flex flex-col gap-y-1">
                <input id="mintAmt" value={mintAmt} className="p-1 rounded-lg" onChange={changeMintAmt} placeholder="Amount" type="number" min={50}/>
                <button onClick={mintToken} className="bg-slate-400 p-1 rounded-md text-white text-xl">{(isPending || isLoading) && mintingIsClicked? "minting" : "mint"}</button>
            </div>
            <div className="flex w-full flex-col gap-y-1">
                <div className="w-5/12 flex justify-between rounded-lg gap-x-2">
                    <input onChange={changeToAddress} value={toAddress? toAddress : undefined} className="p-1 rounded-lg" placeholder="Address" id="toAddress" type="text"/>
                    <input onChange={changeToAmt} value={toAmt? toAmt:undefined} className="p-1 rounded-lg" placeholder="Amount" id="transferAmt" type="number" min={50}/>
                </div>
                <button onClick={transferTokens} className="bg-slate-400 p-1 rounded-md text-white text-xl">{(isPending || isLoading) && transferringIsClicked ? "transferring Tokens" : "Transfer"}</button>
            </div>
            <div className="flex w-full items-center justify-center gap-x-2">
                <div>balance: </div>
                <input type="text" className="text-center" disabled value={parseFloat(formatEther(balance)).toFixed(4) + " " + symbol}/>
            </div>
        </div>
     );
}
 
export default TokenMeasure;