const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  filename: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;
