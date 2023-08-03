import mongoose from 'mongoose';
import idPlugin from 'mongoose-id';

export type User = mongoose.Document & {
  createdAt: Date;
  updatedAt: Date;

  email: string;
  hashedPassword: string;
};

export const userSchema = new mongoose.Schema<User>(
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
    autoCreate: true,
    timestamps: true,
  },
);

userSchema.plugin(idPlugin);
