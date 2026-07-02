import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    avatar: {
      type: String,
      required: true,
    },
    timezone: {
        type: String,
      required: true,
      default:"UTC"  
    },
    pushSubscription: {
         
        type:Object,
        default:null,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return; 
    this.password=await bcrypt.hash(this.password,10)
    
})


userSchema.method.isPasswordCorrect=async function (password) {
    await bcrypt.compare(password,this.password)
}

export const User = mongoose.model("User", userSchema);
