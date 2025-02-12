import Navbar from '../Components/Navbar';
import { createPublicClient, http } from 'viem';
import { baseSepolia, hardhat } from 'viem/chains';
import { useAccount } from 'wagmi';
import TokenMeasure from '../Components/TokenMeasure';
import LiquidityPoolControl from '../Components/LiquidityPoolControl';
import Reserves from '../Components/Reserves';

export const publicClient = createPublicClient({ 
    chain: baseSepolia,
    transport: http()
  })

const LandingPage = () => {
    const account = useAccount()
    
    return ( 
    <div className='w-full min-h-screen'>
        <Navbar/>
        <div className='w-full pt-20 gap-y-4 flex-col flex justify-center items-center'>
            <div className='flex gap-x-4'>
                <div>
                    <TokenMeasure account={account} symbol='CLK'/>
                </div>
                <div>
                    <TokenMeasure account={account} symbol='MIR'/>
                </div>
            </div>
            <div className='flex gap-x-4'>
                <LiquidityPoolControl account={account} symbol='LP'/>
                <div>
                    <Reserves/>
                </div>
            </div>
            {/* <div>
                <Chatbot/>
            </div> */}
        </div>
    </div> 
    );
}
 
export default LandingPage;