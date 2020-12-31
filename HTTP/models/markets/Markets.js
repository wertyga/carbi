import mongoose from 'mongoose';

const marketsSchema = new mongoose.Schema({
  market: {
    type: String,
  },
  pairs: {
    type: Array,
  },
});

export const Markets = mongoose.model('market', marketsSchema);