import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import Moralis from 'moralis';
import axios from 'axios';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1inch API proxy endpoint
app.get('/api/1inch/allowance', async (req: Request, res: Response) => {
  const { tokenAddress, walletAddress } = req.query;
  
  try {
    const response = await axios.get(
      `https://api.1inch.dev/swap/v6.0/42161/approve/allowance`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.ONEINCH_API_KEY}`
        },
        params: {
          tokenAddress,
          walletAddress
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('1inch API error:', error);
    res.status(500).json({ error: 'Failed to fetch allowance from 1inch' });
  }
});

app.get('/api/1inch/approve', async (req: Request, res: Response) => {
  const { tokenAddress, amount } = req.query;

    const url = "https://api.1inch.dev/swap/v6.0/42161/approve/transaction";
    const config = {
        headers: {
    "Authorization": `Bearer ${process.env.ONEINCH_API_KEY}`
    },
        params: {
    "tokenAddress": tokenAddress,
    "amount": amount
    },
        paramsSerializer: {
            indexes: null
        }
    };
    
    try {
        const response = await axios.get(url, config);
        console.log(response.data);
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch approve transaction from 1inch' });
    }
})

app.get('/api/1inch/swap', async (req: Request, res: Response) => {
    const { fromToken, toToken, amount, walletAddress, slippage } = req.query;
    const url = "https://api.1inch.dev/swap/v6.0/42161/swap";
    const config = {
        headers: {
            "Authorization": `Bearer ${process.env.ONEINCH_API_KEY}`
        },
        params: {
            "src": fromToken,
            "dst": toToken,
            "amount": amount,
            "from": walletAddress,
            "origin": walletAddress,
            "slippage": slippage
        }
    };
    try {
        const response = await axios.get(url, config);
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch swap transaction from 1inch' });  
    }
})

// Add new endpoint to get spender address
app.get('/api/1inch/spender', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `https://api.1inch.dev/swap/v6.0/42161/approve/spender`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.ONEINCH_API_KEY}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('1inch API error:', error);
    res.status(500).json({ error: 'Failed to fetch spender address from 1inch' });
  }
});

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(port, async() => {
    await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
    });
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.get('/tokenPrice', async (req: Request, res: Response) => {
  const { address1, address2 } = req.query;
  const tokenPrice1 = await Moralis.EvmApi.token.getTokenPrice({
    chain: "0xa4b1",
    include: "percent_change",
    address: address1 as string,
  });
  const tokenPrice2 = await Moralis.EvmApi.token.getTokenPrice({
    chain: "0xa4b1",
    include: "percent_change",
    address: address2 as string,
  });
  const result = {
    tokenPrice1: tokenPrice1.result.usdPrice,
    tokenPrice2: tokenPrice2.result.usdPrice,
    ratio: tokenPrice1.result.usdPrice / tokenPrice2.result.usdPrice
  };
  res.json(result);
});

export default app; 