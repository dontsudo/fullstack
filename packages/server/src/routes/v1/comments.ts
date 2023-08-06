import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import {
  createComment,
  findComments,
  removeComment,
  updateComment,
} from '../../services/comment';
import { CommentParamsSchema, CommentSchema, CreateCommentBodySchema, PaginationQueryStringSchema, PaginationResponseSchema, PostParamsSchema, UpdateCommentBodySchema } from '../../schema';

const commentsRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.post(
    '/posts/:postId/comments',
    {
      schema: {
        params: PostParamsSchema,
        body: CreateCommentBodySchema,
        security: [{ bearerAuth: [] }],
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const comment = await createComment(
        request.params.postId,
        request.body,
        request.user.id,
      );

      return reply.status(201).send(comment);
    },
  );

  server.get(
    '/posts/:postId/comments',
    {
      schema: {
        params: PostParamsSchema,
        querystring: PaginationQueryStringSchema,
        security: [{ bearerAuth: [] }],
        response: {
          200: PaginationResponseSchema(CommentSchema),
        },
      },
    },
    async (request, reply) => {
      const { postId } = request.params;
      const { page, limit } = request.query;

      const { data, hasMore } = await findComments(postId, {
        page,
        limit,
      });

      return reply.status(200).send({
        data,
        hasMore,
      });
    },
  );

  server.patch(
    '/posts/:postId/comments/:commentId',
    {
      schema: {
        params: CommentParamsSchema,
        body: UpdateCommentBodySchema,
        security: [{ bearerAuth: [] }],
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const { postId, commentId } = request.params;

      const updatedComment = await updateComment(
        postId,
        commentId,
        request.body,
        request.user.id,
      );

      return reply.status(200).send(updatedComment);
    },
  );

  server.delete(
    '/posts/:postId/comments/:commentId',
    {
      schema: {
        params: CommentParamsSchema,
        security: [{ bearerAuth: [] }],
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const { postId, commentId } = request.params;

      await removeComment(postId, commentId, request.user.id);

      return reply.status(204).send();
    },
  );
};

export default commentsRoute;
