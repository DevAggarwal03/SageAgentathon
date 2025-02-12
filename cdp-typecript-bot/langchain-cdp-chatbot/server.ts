import { initializeAgent } from './chatbot';
import express from "express";
import { HfInference } from "@huggingface/inference";
import cors from "cors";
import { ethers } from "ethers";
import lpContractDetails from "./Constants/ArbitrumSepolia/LiquidityPool.json";
import clkTokenDetails from "./Constants/ArbitrumSepolia/CLKToken.json";
import mirTokenDetails from "./Constants/ArbitrumSepolia/MIRToken.json";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, encodeFunctionData, http } from "viem";
import { baseSepolia } from "viem/chains";
import { ViemWalletProvider } from "@coinbase/agentkit";

const app = express();

app.use(express.json());
app.use(cors());
require('dotenv').config();

const hf = new HfInference(process.env.HUGGING_FACE);

const lpContractABI = lpContractDetails.abi;
const clkTokenABI = clkTokenDetails.abi;
const mirTokenABI = mirTokenDetails.abi;

// const RPC_URL = 'https://sepolia.base.org';
const RPC_URL = 'https://421614.rpc.thirdweb.com';

const privateKey = process.env.ACC_PRIVATE_KEY;

const lpContractAddress = lpContractDetails.address;
const clkTokenAddress = clkTokenDetails.address;
const mirTokenAddress = mirTokenDetails.address;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(privateKey!,provider);

const lpContract = new ethers.Contract(lpContractAddress,lpContractABI,wallet);
const clkTokenContract = new ethers.Contract(clkTokenAddress,clkTokenABI,wallet);
const mirTokenContract = new ethers.Contract(mirTokenAddress,mirTokenABI,wallet);

const account = privateKeyToAccount(
    `0x${process.env.ACC_PRIVATE_KEY}`,
  ); 

const client = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(),
  });

const walletProvider = new ViemWalletProvider(client);


async function allowLpContractToSpendTokens(amount: string) {
  try{
    const tx1 = await clkTokenContract.approve(lpContractAddress, ethers.parseEther(amount!));
    await tx1.wait();
    const tx2 = await mirTokenContract.approve(lpContractAddress, ethers.parseEther(amount!));
    await tx2.wait();
    console.log(tx1.hash);
    console.log(tx2.hash);
    return `CLK token transaction hash : ${tx1.hash} and MIR token transaction hash : ${tx2.hash}`
  }catch(e){
    console.log("unable to update price : " ,e);
  } 
}

async function swapMir(amount: string) {
    try {
        console.log("amount : ",amount);
        const tx = await walletProvider.sendTransaction({
            to: lpContractAddress as `0x${string}`,
            data: encodeFunctionData({
                abi: lpContractABI,
                functionName: "swapBtoA",
                args: [ethers.parseUnits(amount.toString(), 'ether')],
            }),
        });
        console.log(tx);
        return `Swap transaction hash : ${tx}`
        
    } catch (error) {
        console.log(error);
        return `unable to swap tokens error: ${error}`
    }   
}

async function swapClk(amount: string) {
try {
    console.log("amount : ",amount);
    const tx = await walletProvider.sendTransaction({
        to: lpContractAddress as `0x${string}`,
        data: encodeFunctionData({
            abi: lpContractABI,
            functionName: "swapAtoB",
            args: [ethers.parseUnits(amount.toString(), 'ether')],
        }),
    });
    console.log(tx);
    return `Swap transaction hash : ${tx}`
    
} catch (error) {
    console.log(error);
    return `unable to swap tokens error: ${error}`
}   
}

async function provideLiquidity(amount: string) {
  try {
    console.log("amount : ",amount);
    const tx = await walletProvider.sendTransaction({
      to: lpContractAddress as `0x${string}`,
      data: encodeFunctionData({
        abi: lpContractABI,
        functionName: "addLiquidity",
        args: [ethers.parseUnits(amount.toString(), 'ether'), ethers.parseUnits(amount.toString(), 'ether')],
      }),
    });
    console.log(tx);
    return `Add liquidity transaction hash : ${tx}`
  } catch (error) {
    console.log(error);
    return `unable to add liquidity error: ${error}`
  }
}

async function removeLiquidity(amount: string) {
  try {
    console.log("amount : ",amount);
    const tx = await walletProvider.sendTransaction({
      to: lpContractAddress as `0x${string}`,
      data: encodeFunctionData({
        abi: lpContractABI,
        functionName: "removeLiquidity",
        args: [ethers.parseUnits(amount.toString(), 'ether')],
      }),
    });
    console.log(tx);
    return `Remove liquidity transaction hash : ${tx}`  
  } catch (error) {
    console.log(error);
    return `unable to remove liquidity error: ${error}`
  }
}


app.post("/chat/pool", async (req : any, res : any) => {
  const { message } = req.body;
  console.log(message);
  try {
    const intent = await hf.request({
      model: "facebook/bart-large-mnli",
      inputs: message,
      parameters: {
        candidate_labels: ["allow", "swap mir", "swap clk", "provide liquidity", "remove liquidity"],
      },
    });

    //@ts-ignore
    const queryType = intent.labels[0];
    console.log(intent)
    console.log("Query type:", queryType);
    switch (queryType) {
      case "allow":
        const response = await allowLpContractToSpendTokens("2");
        return res.json({ type: "allow spender", response: response });

      case "swap mir":
        const mirTokens = message.match(/\d+(\.\d+)?/g);
        const swapMirResponse = await swapMir(mirTokens[0]);
        return res.json({ type: "swap mir", response: swapMirResponse });

      case "swap clk":
        const clkTokens = message.match(/\d+(\.\d+)?/g);
        const swapClkResponse = await swapClk(clkTokens[0]);
        return res.json({ type: "swap clk", response: swapClkResponse });
      
      case "provide liquidity":
        const provideTokens = message.match(/\d+(\.\d+)?/g);
        const provideLiquidityResponse = await provideLiquidity(provideTokens[0]);
        return res.json({ type: "provide liquidity", response: provideLiquidityResponse });

      case "remove liquidity":
        const removeTokens = message.match(/\d+(\.\d+)?/g);
        const removeLiquidityResponse = await removeLiquidity(removeTokens[0]);
        return res.json({ type: "remove liquidity", response: removeLiquidityResponse });

      default:
        return res.status(400).json({ error: "Unknown query type" });
    }
  } catch (error : any) {
    console.error("Error processing query:", error.message);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

let agent: any;
let config: any;

(async () => {
  try {
    const result = await initializeAgent();
    agent = result.agent;
    config = result.config;
    console.log('Agent initialized successfully');
  } catch (error) {
    console.error('Failed to initialize agent:', error);
    process.exit(1);
  }
})();

app.post('/chat/wallet', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await agent.stream(
      { messages: [{ type: 'human', content: message }] },
      config
    );

    let lastContent = '';
    for await (const chunk of stream) {
      let content = '';
      if ('agent' in chunk) {
        content = chunk.agent.messages[0].content;
      } else if ('tools' in chunk) {
        content = chunk.tools.messages[0].content;
      }

      if (content && content !== lastContent) {
        lastContent = content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to process message' })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 