const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClipboardItemSchema = new Schema({
  content: { type: {}, required: true },
  type: { type: String, enum: ['text', 'file'], required: true },
});

exports.ClipboardItemSchema = ClipboardItemSchema;
