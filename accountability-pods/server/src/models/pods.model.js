import mongoose, { Schema } from "mongoose";

const podSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    goal: {
      type: String,
      required: true,
      trim: true,
    },

    frequency: {
      type: String,
      required: true,
      enum: ["daily", "weekdays", "monthly", "custom"],
      default: "daily",
    },

    customDays: {
      type: [Number],
      default: [],
      validate: {
        validator: (days) =>
          days.every((day) => Number.isInteger(day) && day >= 1 && day <= 7),
        message: "Custom days must contain values from 1 to 7",
      },
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    inviteCode: {
      type: String,
      unique: true,
      required: true,
    },

    maxMembers: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  },
);

const Pod = mongoose.model("Pod", podSchema);

export default Pod;