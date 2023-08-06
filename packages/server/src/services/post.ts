import prisma from '../lib/prisma';
import { NotFound } from '../lib/httpError';
import { CreatePost, UpdatePost } from '../schema';

const createPost = async (data: CreatePost, authorId: string) => {
  return prisma.post.create({
    data: {
      ...data,
      authorId,
    },
  });
};

const findPosts = async ({ page, limit }) => {
  const posts = await prisma.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
    include: {
      author: true,
    },
  });

  const hasMore = posts.length === limit;

  return { data: posts, hasMore };
};

const findPostById = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  });

  if (!post) {
    throw new NotFound('post not found');
  }

  return post;
};

const updatePost = async (id: string, data: UpdatePost, authorId: string) => {
  const updatedPost = await prisma.post.update({
    where: {
      id,
      authorId,
    },
    data,
  });

  return updatedPost;
};

const removePost = async (id: string, authorId: string) => {
  return prisma.post.delete({
    where: {
      id,
      authorId,
    },
  });
};

export { createPost, findPosts, findPostById, updatePost, removePost };
