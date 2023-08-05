import { FastifyInstance } from 'fastify';
import { FilterQuery, UpdateQuery } from 'mongoose';

import { Post } from '../models/post';
import { upsertTags } from './tag';
import { CreatePost, UpdatePost } from '../schemas/post';

export const getPosts = (server: FastifyInstance) => {
  return async ({
    where = {},
    page,
    limit,
  }: {
    where?: FilterQuery<Post>;
    page: number;
    limit: number;
  }) => {
    return server.store.Post.find(where)
      .select('-content')
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author')
      .populate('tags');
  };
};

export const getPostById = (server: FastifyInstance) => {
  return async (id: string) => {
    return server.store.Post.findById(id)
      .populate('author')
      .populate('tags')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          model: 'User',
        },
      });
  };
};

export const createPost = (server: FastifyInstance) => {
  return async ({ title, content, author, tags }: CreatePost) => {
    const resolvedTags = await upsertTags(server)(tags);

    return server.store.Post.create({
      title,
      content,
      author,
      tags: resolvedTags,
    });
  };
};

export const findPostAndUpdate = (server: FastifyInstance) => {
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

    return server.store.Post.findOneAndUpdate(where, updateData, {
      new: true,
    });
  };
};

export const findPostAndDelete = (server: FastifyInstance) => {
  return async (where: FilterQuery<Post>) => {
    return server.store.Post.findOneAndDelete(where);
  };
};
