import mongoose, { Schema } from "mongoose";

const checkInSchema = new Schema(
  {
    pod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pod",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      trim: true,
    },

    photoUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

checkInSchema.index(
  { pod: 1, user: 1, date: 1 },
  { unique: true }
);

const CheckIn = mongoose.model("CheckIn", checkInSchema);

export default CheckIn;