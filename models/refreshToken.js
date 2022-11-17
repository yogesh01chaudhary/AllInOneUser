const { model, Schema } = require("mongoose");
const refreshTokenSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});
module.exports = model("refreshtoken", refreshTokenSchema);
