import { FastifyInstance } from 'fastify';
import { FilterQuery } from 'mongoose';

import { Comment } from '../models/comment';
import {
  CreateComment,
  DeleteComment,
  UpdateComment,
} from '../schemas/comment';
import { getPostById } from './post';
import { InvalidCredentialsError, NotFoundError } from '../lib/httpError';

export const findComments = (server: FastifyInstance) => {
  return async ({ where }: { where: FilterQuery<Comment> }) => {
    return server.store.Comment.find(where);
  };
};

export const createComment = (server: FastifyInstance) => {
  return async ({ content, postId, authorId }: CreateComment) => {
    const post = await getPostById(server)(postId);

    if (!post) {
      throw new NotFoundError('post not found');
    }

    const comment = await server.store.Comment.create({
      content,
      author: authorId,
    });

    return post.updateOne({
      $push: {
        comments: comment._id,
      },
    });
  };
};

export const updateComment = (server: FastifyInstance) => {
  return async ({ content, authorId, commentId }: UpdateComment) => {
    const comment = await server.store.Comment.findOne({
      _id: commentId,
    });

    if (!comment) {
      throw new NotFoundError('comment not found');
    }

    if (comment.author.toString() !== authorId) {
      throw new InvalidCredentialsError('invalid credentials');
    }

    return comment.updateOne({
      $set: {
        content,
      },
    });
  };
};

export const deleteComment = (server: FastifyInstance) => {
  return async ({ commentId, authorId }: DeleteComment) => {
    return server.store.Comment.deleteOne({
      _id: commentId,
      author: authorId,
    });
  };
};
