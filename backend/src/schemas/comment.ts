import { Static, Type } from '@fastify/type-provider-typebox';

import { entitySchema } from './common';
import { userWithoutPassword } from './user';

export const commentSchema = Type.Composite([
  entitySchema,
  Type.Object({
    content: Type.String({
      minLength: 5,
      maxLength: 255,
    }),
    author: userWithoutPassword,
  }),
]);

export const commentResponseSchema = commentSchema;

export const createCommentParamSchema = Type.Object({
  postId: Type.String(),
});

export const createCommentBodySchema = Type.Object({
  content: Type.String({
    minLength: 5,
    maxLength: 255,
  }),
});

export const createCommentSchema = Type.Composite([
  createCommentBodySchema,
  createCommentParamSchema,
  Type.Object({
    authorId: Type.String(),
  }),
]);

export type CreateComment = Static<typeof createCommentSchema>;

export const updateCommentParamSchema = Type.Object({
  postId: Type.String(),
  commentId: Type.String(),
});

export const updateCommentBodySchema = Type.Object({
  content: Type.String({
    minLength: 5,
    maxLength: 255,
  }),
});

export const updateCommentSchema = Type.Composite([
  updateCommentBodySchema,
  updateCommentParamSchema,
  Type.Object({
    authorId: Type.String(),
  }),
]);

export type UpdateComment = Static<typeof updateCommentSchema>;

export const deleteCommentParamSchema = Type.Object({
  postId: Type.String(),
  commentId: Type.String(),
});

export const deleteCommentSchema = Type.Composite([
  deleteCommentParamSchema,
  Type.Object({
    authorId: Type.String(),
  }),
]);

export type DeleteComment = Static<typeof deleteCommentSchema>;
