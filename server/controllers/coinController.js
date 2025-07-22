// controllers/coinController.js

const axios = require('axios');
const CurrentData = require('../models/CurrentData');
const HistoryData = require('../models/HistoryData');

const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

// GET /api/coins
exports.getCoins = async (req, res) => {
  try {
    const response = await axios.get(COINGECKO_API);
    const data = response.data;

    // Overwrite current data in DB
    await CurrentData.deleteMany({});
    const mappedData = data.map(coin => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      timestamp: new Date(coin.last_updated),
    }));

    await CurrentData.insertMany(mappedData);

    res.json(mappedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch coins data' });
  }
};

// POST /api/history
exports.postHistory = async (req, res) => {
  try {
    const response = await axios.get(COINGECKO_API);
    const data = response.data;

    const mappedData = data.map(coin => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      timestamp: new Date(coin.last_updated),
    }));

    await HistoryData.insertMany(mappedData);

    res.json({ message: 'History data saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save history data' });
  }
};
