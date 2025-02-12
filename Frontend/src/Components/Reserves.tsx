import usdcImg from '../assets/usdc.png'
import { useEffect, useState } from "react";
import { publicClient } from "../Pages/LandingPage";
import lpJson from '../Constants/ArbitrumSepolia/LiquidityPool.json'
// import lpJson from '../Constants/LineaSepolia/LiquidityPool.json'
import { formatEther } from "viem";

const Reserves = () => {
    const [clkReserve, setClkReserve] = useState<any>(0);
    const [mirReserve, setMirReserve] = useState<any>(0);
    const getReserveData = async() => {
        const resA = await publicClient.readContract({
            address: `0x${lpJson.address.slice(2)}`,
            abi: lpJson.abi,
            functionName: "reserveA",
            args: []
        })
        const resB = await publicClient.readContract({
            address: `0x${lpJson.address.slice(2)}`,
            abi: lpJson.abi,
            functionName: "reserveB",
            args: []
        })
        console.log(resA, resB)
        setClkReserve(resA);
        setMirReserve(resB);
    }

    useEffect(() => {getReserveData()}, []);

    return ( <div className="flex text-white justify-center items-center h-full gap-y-4 flex-col">
        <span>Reserves in the Pool</span>
        <div className="w-full justify-center items-center flex gap-x-3">
            <div className="flex flex-col text-white items-center justify-between gap-y-2">
                <img className='w-full h-full' src={usdcImg}/>
                <span>{parseFloat(formatEther(clkReserve)).toFixed(4)} CLK</span>
            </div>
            <div className="flex items-center text-white flex-col justify-between h-full gap-y-2">
                <img className='w-full h-full' src={"https://ethereum-optimism.github.io/data/DAI/logo.svg"}/>
                <span>{parseFloat(formatEther(mirReserve)).toFixed(4)} MIR</span> 
            </div>
        </div>
    </div> );
}
 
export default Reserves;