import mongoose from 'mongoose';
import idPlugin from 'mongoose-id';

export type Tag = mongoose.Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  posts: mongoose.Types.ObjectId[];
};

export const tagSchema = new mongoose.Schema<Tag>(
  {
    name: {
      type: String,
      index: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    createdAt: Date,
    updatedAt: Date,
  },
  {
    autoCreate: true,
    timestamps: true,
  },
);

tagSchema.plugin(idPlugin);
