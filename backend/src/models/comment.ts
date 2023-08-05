import { Document, Schema } from 'mongoose';

import { User } from './user';

export interface Comment extends Document {
  createdAt: Date;
  updatedAt: Date;
  content: string;
  author: User;
}

export const commentSchema = new Schema<Comment>(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
  },
);
