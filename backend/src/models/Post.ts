import mongoose from 'mongoose';
import idPlugin from 'mongoose-id';

export type Post = mongoose.Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
};

export const postSchema = new mongoose.Schema<Post>(
  {
    title: {
      type: String,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

postSchema.plugin(idPlugin);
