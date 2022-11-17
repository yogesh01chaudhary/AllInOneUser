const { Schema, model } = require("mongoose");
const WalletSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  balance: {
    type: Number,
  },
});

module.exports = model("wallet", WalletSchema);
