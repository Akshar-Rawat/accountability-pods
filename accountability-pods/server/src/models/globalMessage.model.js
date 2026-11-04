import mongoose, { Schema } from "mongoose";

const globalMessageSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true, maxlength: 500 },
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

globalMessageSchema.index({ createdAt: -1 });
export default mongoose.model("GlobalMessage", globalMessageSchema);
