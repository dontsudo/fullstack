import mongoose, { Schema } from 'mongoose';

export interface Post {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  author: mongoose.Types.ObjectId;
  title: string;
  content: string;
}

export const PostSchema = new Schema<Post>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },

    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
  },
);
