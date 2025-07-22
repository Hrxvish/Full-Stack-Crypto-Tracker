import mongoose from 'mongoose';

const currentDataSchema = new mongoose.Schema({
  coinId: { type: String, required: true },
  name: String,
  symbol: String,
  price: Number,
  marketCap: Number,
  change24h: Number,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('CurrentData', currentDataSchema);
