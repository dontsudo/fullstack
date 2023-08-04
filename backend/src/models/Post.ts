import { Schema, Document } from 'mongoose';
import idPlugin from 'mongoose-id';

import { Comment } from './comment';
import { User } from './user';
import { Tag } from './tag';

export interface Post extends Document {
  id: string;
  title: string;
  content: string;
  author: User;
  comments: Comment[];
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
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

postSchema.plugin(idPlugin);
