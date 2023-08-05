import { Schema, Document } from 'mongoose';

import { Comment } from './comment';
import { User } from './user';
import { Tag } from './tag';

export interface Post extends Document {
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  author: User;
  tags: Tag[];
  comments: Comment[];
}

export const postSchema = new Schema<Post>(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
  },
  {
    timestamps: true,
    autoCreate: true,
  },
);
