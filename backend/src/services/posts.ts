import { FastifyInstance } from 'fastify';
import { FilterQuery, UpdateQuery } from 'mongoose';

import { Post } from '../models/post';
import { upsertTags } from './tags';
import { CreatePost, UpdatePost } from '../schemas/post';

export const getPosts = (server: FastifyInstance) => {
  const postModel = server.store.Post;

  return async ({
    where = {},
    page,
    limit,
  }: {
    where?: FilterQuery<Post>;
    page: number;
    limit: number;
  }) => {
    return postModel
      .find(where)
      .select('-content') // exclude content
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author')
      .populate('tags');
  };
};

export const getPostById = (server: FastifyInstance) => {
  const postModel = server.store.Post;

  return async (id: string) => {
    return postModel.findById(id).populate('author').populate('comments');
  };
};

export const createPost = (server: FastifyInstance) => {
  const postModel = server.store.Post;

  return async ({ title, content, author, tags = [] }: CreatePost) => {
    const resolvedTags = await upsertTags(server)(tags);
    return postModel.create({ title, content, author, tags: resolvedTags });
  };
};

export const findPostAndUpdate = (server: FastifyInstance) => {
  const postModel = server.store.Post;

  return async ({
    where,
    data,
  }: {
    where: FilterQuery<Post>;
    data: UpdatePost;
  }) => {
    const updateData: UpdateQuery<Post> = {
      ...data,
      tags: data.tags ? await upsertTags(server)(data.tags) : undefined,
    };

    return postModel.findOneAndUpdate(where, updateData, {
      new: true,
    });
  };
};

export const findPostAndDelete = (server: FastifyInstance) => {
  const postModel = server.store.Post;

  return async (where: FilterQuery<Post>) => {
    return postModel.findOneAndDelete(where);
  };
};
