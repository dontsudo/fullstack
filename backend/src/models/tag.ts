import { Schema, Document } from 'mongoose';

import { Post } from './post';

export interface Tag extends Document {
  name: string;
  posts: Post[];
  createdAt: Date;
  updatedAt: Date;
}

export const tagSchema = new Schema<Tag>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    timestamps: true,
    autoCreate: true,
  },
);
