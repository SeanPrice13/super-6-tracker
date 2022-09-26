const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  draw: {
    type: Array,
    required: true,
  },
  letter: {
    type: String,
    required: false,
  },
  key: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Draw', drawSchema);