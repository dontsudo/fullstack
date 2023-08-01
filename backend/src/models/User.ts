import { Schema } from 'mongoose';

export interface User {
  email: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<User>({
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
});
