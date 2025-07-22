import cron from 'node-cron';
import axios from 'axios';
import CurrentData from '../models/CurrentData.js';

const fetchHistoryJob = cron.schedule('0 * * * *', async () => {
  console.log("⏰ Running fetchHistory cron job...");

  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        price_change_percentage: '24h'
      }
    });

    const coins = response.data;

    for (const coin of coins) {
      await CurrentData.findOneAndUpdate(
        { coinId: coin.id },
        {
          coinId: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price,
          marketCap: coin.market_cap,
          change24h: coin.price_change_percentage_24h,
          timestamp: new Date()
        },
        { upsert: true, new: true }
      );
    }

    console.log("✅ Coin data updated successfully");
  } catch (error) {
    console.error("❌ Error updating coin data:", error);
  }
}, { scheduled: false });

export default fetchHistoryJob;
