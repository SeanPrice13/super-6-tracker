const mongoose = require("mongoose");

const combinationSchema = new mongoose.Schema({
  combo: {
    type: Array,
    required: true,
  },
  count: {
    type: Number,
  },
});

module.exports = mongoose.model("Combination", combinationSchema);
