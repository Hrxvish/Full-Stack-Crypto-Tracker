const axios = require('axios');
const Coin = require('../models/Coin');
const History = require('../models/History');

exports.getCoins = async (req, res) => {
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

    // Overwrite current data
    await Coin.deleteMany({});
    const formattedCoins = coins.map(c => ({
      coinId: c.id,
      name: c.name,
      symbol: c.symbol,
      price: c.current_price,
      marketCap: c.market_cap,
      change24h: c.price_change_percentage_24h,
      timestamp: new Date(c.last_updated)
    }));
    await Coin.insertMany(formattedCoins);

    res.json(formattedCoins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.postHistory = async (req, res) => {
  try {
    const coins = await Coin.find({});
    const historyData = coins.map(c => ({
      coinId: c.coinId,
      name: c.name,
      symbol: c.symbol,
      price: c.price,
      marketCap: c.marketCap,
      change24h: c.change24h,
      timestamp: new Date()
    }));
    await History.insertMany(historyData);
    res.json({ message: 'History saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
