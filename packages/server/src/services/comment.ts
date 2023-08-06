import { NotFound } from '../lib/httpError';
import prisma from '../lib/prisma';
import { CreateComment, UpdateComment } from '../schema';
import { findPostById } from './post';

const createComment = async (
  postId: string,
  data: CreateComment,
  authorId: string,
) => {
  const comment = await prisma.comment.create({
    data: {
      ...data,
      postId,
      authorId,
    },
  });

  return comment;
};

const findComments = async (postId: string, { page, limit }) => {
  const post = await findPostById(postId);
  const comments = await prisma.comment.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      post,
    },
    include: {
      author: true,
    },
  });

  const hasMore = comments.length === limit;

  return { data: comments, hasMore };
};

const updateComment = async (
  postId: string,
  commentId: string,
  data: UpdateComment,
  authorId: string,
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
      postId,
      authorId,
    },
  });

  if (!comment) {
    throw new NotFound('comment not found');
  }

  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data,
  });

  return updatedComment;
};

const removeComment = async (
  postId: string,
  commentId: string,
  authorId: string,
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
      postId,
      authorId,
    },
  });

  if (!comment) {
    throw new NotFound('comment not found');
  }

  return prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
};

export { createComment, findComments, updateComment, removeComment };
