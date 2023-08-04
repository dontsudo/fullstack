import { Schema, Document } from 'mongoose';
import idPlugin from 'mongoose-id';

export interface User extends Document {
  id: string;
  email: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
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

userSchema.plugin(idPlugin);
