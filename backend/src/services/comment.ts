import { FastifyInstance } from 'fastify';
import { FilterQuery } from 'mongoose';

import { Comment } from '../models/comment';

export const findComments = (server: FastifyInstance) => {
  const commentModel = server.store.Comment;

  return async ({ where }: { where: FilterQuery<Comment> }) => {
    return commentModel.find(where);
  };
};
