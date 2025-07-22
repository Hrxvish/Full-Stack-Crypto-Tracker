// models/HistoryData.js
const mongoose = require('mongoose');

const HistoryDataSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true
  },
  prices: [
    {
      date: {
        type: Date,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model('HistoryData', HistoryDataSchema);
