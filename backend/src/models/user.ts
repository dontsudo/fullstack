import { Schema, Document } from 'mongoose';

export interface User extends Document {
  createdAt: Date;
  updatedAt: Date;
  email: string;
  hashedPassword: string;
}

export const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
  },
);
