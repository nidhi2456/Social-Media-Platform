const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

MessageSchema.index({ sender: 1 });
MessageSchema.index({ receiver: 1 });

module.exports = mongoose.model('Message', MessageSchema);
