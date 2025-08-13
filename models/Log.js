import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['error', 'warn', 'info', 'debug'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'backend'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ip: String,
  userAgent: String,
  method: String,
  url: String,
  statusCode: Number,
  responseTime: Number
}, {
  timestamps: true
});

// Index for efficient querying
logSchema.index({ timestamp: -1 });
logSchema.index({ level: 1, timestamp: -1 });

export default mongoose.model('Log', logSchema);