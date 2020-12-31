import mongoose from 'mongoose';

const pairsSchema = new mongoose.Schema({
  pairs: {
    type: Array,
  },
});

export const Pairs = mongoose.model('pair', pairsSchema);