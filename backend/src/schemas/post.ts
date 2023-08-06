import { Static, Type } from '@fastify/type-provider-typebox';

import { entitySchema } from './common';

export const postSchema = Type.Composite([
  Type.Object({
    title: Type.String(),
    content: Type.String(),
    published: Type.Boolean(),
  }),
  entitySchema,
]);

export const postParamsSchema = Type.Object({
  postId: Type.String(),
});

export const createPostBodySchema = Type.Object({
  title: Type.String(),
  content: Type.String(),
  published: Type.Boolean({
    default: false,
  }),
});

export type CreatePost = Static<typeof createPostBodySchema>;

export const updatePostBodySchema = Type.Object({
  title: Type.Optional(Type.String()),
  content: Type.Optional(Type.String()),
  published: Type.Optional(Type.Boolean()),
});

export type UpdatePost = Static<typeof updatePostBodySchema>;
