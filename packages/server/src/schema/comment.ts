import { Static, Type } from '@fastify/type-provider-typebox';
import { EntitySchema } from './common';
import { UserWithoutPasswordSchema } from './user';

export const CommentSchema = Type.Composite([
  EntitySchema,
  Type.Object({
    content: Type.String({
      minLength: 5,
      maxLength: 255,
    }),
    author: UserWithoutPasswordSchema,
  }),
]);

export const CommentParamsSchema = Type.Object({
  postId: Type.String(),
  commentId: Type.String(),
});

export const CreateCommentBodySchema = Type.Object({
  content: Type.String(),
});

export const UpdateCommentBodySchema = Type.Object({
  content: Type.String({
    minLength: 5,
    maxLength: 255,
  }),
});

export type CreateComment = Static<typeof CreateCommentBodySchema>;
export type UpdateComment = Static<typeof UpdateCommentBodySchema>;
