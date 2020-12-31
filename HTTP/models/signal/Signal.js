import mongoose from 'mongoose';

const signalSchema = new mongoose.Schema({
  symbol: {
    type: String,
    require: true,
  },
  markets: {
    type: Array,
    require: true,
  },
  owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      require: true,
  },
  notifies: {
    type: [{
      notifyType: String,
      value: Number,
      active: {
        type: Boolean,
        default: true,
      },
      createdAt: {
        type: Date,
        default: new Date(),
      },
    }],
    default: [],
  },
});

export const Signal = mongoose.model('signal', signalSchema);