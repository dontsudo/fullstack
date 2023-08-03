import mongoose from 'mongoose';
import idPlugin from 'mongoose-id';

export type Comment = mongoose.Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  content: string;
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
};

export const commentSchema = new mongoose.Schema<Comment>({
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
});

commentSchema.plugin(idPlugin);
