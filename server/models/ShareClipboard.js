const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ClipboardItemSchema } = require('./ClipboardItem');

const ShareClipboardSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  clipboards_id: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
});

module.exports = mongoose.model('ShareClipboard', ShareClipboardSchema);
