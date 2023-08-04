import { Schema, Document } from 'mongoose';
import idPlugin from 'mongoose-id';

import { Post } from './post';

export interface Tag extends Document {
  id: string;
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

tagSchema.plugin(idPlugin);
