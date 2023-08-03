import { FastifyInstance } from 'fastify';
import { FilterQuery } from 'mongoose';

import type { Post } from '../models/Post';

export const findPosts = (server: FastifyInstance) => {
  const postModel = server.store.Post;

  return async ({ page, limit }): Promise<Post[]> => {
    const posts = await postModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', '-hashedPassword -__v -createdAt -updatedAt');

    return posts;
  };
};

export const findPost = (server: FastifyInstance) => {
  const postModel = server.store.Post;

  return async (where: FilterQuery<Post>): Promise<Post | null> => {
    const post = await postModel.findOne(where);

    return post;
  };
};

export const createPost = (server: FastifyInstance) => {
  const postModel = server.store.Post;

  return async ({ title, content, author }): Promise<Post> => {
    const post = await postModel.create({
      title,
      content,
      author,
    });

    return post;
  };
};

export const findPostAndUpdate = (server: FastifyInstance) => {
  const postModel = server.store.Post;

  return async (
    where: FilterQuery<Post>,
    data: Partial<Post>,
  ): Promise<Post | null> => {
    const updatedPost = await postModel.findOneAndUpdate(where, data, {
      new: true,
    });

    return updatedPost;
  };
};

export const findPostAndDelete = (server: FastifyInstance) => {
  const postModel = server.store.Post;

  return async (where: FilterQuery<Post>): Promise<Post | null> => {
    const deletedPost = await postModel.findOneAndDelete(where);

    return deletedPost;
  };
};
