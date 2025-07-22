const cron = require('node-cron');
const axios = require('axios');
const History = require('../models/History');

console.log('Cron job initialized');

const fetchHistoryJob = cron.schedule('* * * * *', async () => {
  console.log('⏰ [CRON JOB] Fetching data for history...');

  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1
      }
    });

    const coins = response.data;

    const formattedCoins = coins.map(c => ({
      coinId: c.id,
      name: c.name,
      symbol: c.symbol,
      price: c.current_price,
      marketCap: c.market_cap,
      change24h: c.price_change_percentage_24h,
      timestamp: new Date(c.last_updated)
    }));

    await History.insertMany(formattedCoins);

    console.log('✅ [CRON JOB] History data saved successfully.');
  } catch (error) {
    console.error('❌ [CRON JOB] Failed to fetch or save history data:', error.message);
  }
});

module.exports = fetchHistoryJob;
