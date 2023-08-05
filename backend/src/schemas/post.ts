import { Static, Type } from '@fastify/type-provider-typebox';

import { entitySchema } from './common';
import { userResponseSchema } from './user';
import { createTagBodySchema, tagNameSchema } from './tag';
import { commentResponseSchema } from './comment';

export const postSchema = Type.Composite([
  Type.Object({
    title: Type.String({
      minLength: 5,
      maxLength: 32,
    }),
    content: Type.String({
      minLength: 5,
      maxLength: 255,
    }),
    author: userResponseSchema,
    tags: Type.Array(tagNameSchema),
    comments: Type.Array(commentResponseSchema),
  }),
  entitySchema,
]);

export const postResponseSchema = postSchema;

export type PostResponse = Static<typeof postResponseSchema>;

export const postListResponseSchema = Type.Array(
  Type.Omit(postSchema, ['content', 'comments']),
);

export type PostListResponse = Static<typeof postListResponseSchema>;

export const createPostBodySchema = Type.Object({
  title: Type.String(),
  content: Type.String(),
  tags: Type.Optional(Type.Array(createTagBodySchema)),
});

export const createPostSchema = Type.Composite([
  createPostBodySchema,
  Type.Object({
    author: Type.String(),
  }),
]);

export type CreatePost = Static<typeof createPostSchema>;

export const updatePostBodySchema = Type.Object({
  title: Type.Optional(Type.String()),
  content: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(tagNameSchema)),
});

export type UpdatePost = Static<typeof updatePostBodySchema>;
