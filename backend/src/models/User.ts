import mongoose, { Schema } from 'mongoose';

export interface User {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  email: string;
  hashedPassword: string;
}

export const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      index: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
  },
);
