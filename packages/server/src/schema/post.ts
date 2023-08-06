import { Static, Type } from '@fastify/type-provider-typebox';
import { EntitySchema } from './common';
import { UserWithoutPasswordSchema } from './user';

export const PostSchema = Type.Composite([
  EntitySchema,
  Type.Object({
    title: Type.String(),
    author: UserWithoutPasswordSchema,
    content: Type.String(),
    published: Type.Boolean(),
  }),
]);

export const PostParamsSchema = Type.Object({
  postId: Type.String(),
});

export const CreatePostBodySchema = Type.Object({
  title: Type.String(),
  content: Type.String(),
  published: Type.Boolean({
    default: false,
  }),
});

export const UpdatePostBodySchema = Type.Object({
  title: Type.Optional(Type.String()),
  content: Type.Optional(Type.String()),
  published: Type.Optional(Type.Boolean()),
});

export type CreatePost = Static<typeof CreatePostBodySchema>;
export type UpdatePost = Static<typeof UpdatePostBodySchema>;
