import mongoose from 'mongoose';
import idPlugin from 'mongoose-id';

import { Post } from './post';
import { User } from './user';

export interface Comment extends mongoose.Document {
  id: string;
  content: string;
  post: Post;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export const commentSchema = new mongoose.Schema<Comment>(
  {
    content: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
  },
);

commentSchema.plugin(idPlugin);
