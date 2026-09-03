import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
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
    text: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "system"],
      default: "text",
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

messageSchema.index({ pod: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
