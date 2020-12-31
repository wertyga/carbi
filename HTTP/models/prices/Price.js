import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  symbol: {
    type: String,
    unique: true,
  },
  prices: {
    type: [{
      market: {
        type: String,
      },
      price: {
        type: String,
      },
    }],
  },
});

export const Price = mongoose.model('price', priceSchema);