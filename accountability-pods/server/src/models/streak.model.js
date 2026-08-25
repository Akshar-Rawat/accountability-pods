import mongoose, { Schema } from "mongoose";

const streakSchema = new Schema(
  {
    pod: { type: mongoose.Schema.Types.ObjectId, ref: "Pod", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCheckInDate: { type: String, default: null },
  },
  { timestamps: true },
);
streakSchema.index({ pod: 1, user: 1 }, { unique: true });
const Streak = mongoose.model("Streak", streakSchema);

export default Streak;
