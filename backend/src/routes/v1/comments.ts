import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import {
  createCommentBodySchema,
  createCommentParamSchema,
  deleteCommentParamSchema,
  updateCommentBodySchema,
  updateCommentParamSchema,
} from '../../schemas/comment';
import {
  createComment,
  deleteComment,
  updateComment,
} from '../../services/comment';
import { JwtUserPayload } from '../../plugins/jwt';
import { getPostById } from '../../services/post';

const commentsRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.post(
    '/posts/:postId/comments',
    {
      schema: {
        params: createCommentParamSchema,
        body: createCommentBodySchema,
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const { id: authorId } = request.user as JwtUserPayload;
      const { postId } = request.params;
      const { content } = request.body;

      await createComment(server)({
        content,
        postId,
        authorId,
      });

      return reply.status(201).send();
    },
  );

  server.patch(
    '/posts/:postId/comments/:commentId',
    {
      schema: {
        params: updateCommentParamSchema,
        body: updateCommentBodySchema,
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const user = request.user as JwtUserPayload;
      const { postId, commentId } = request.params;
      const { content } = request.body;

      const post = await getPostById(server)(postId);

      const comment = await updateComment(server)({
        postId,
        authorId: user.id,
        commentId,
        content,
      });

      return reply.status(204).send(comment);
    },
  );

  server.delete(
    '/posts/:postId/comments/:commentId',
    {
      schema: {
        params: deleteCommentParamSchema,
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const user = request.user as JwtUserPayload;
      const { commentId, postId } = request.params;

      await deleteComment(server)({
        commentId,
        postId,
        authorId: user.id,
      });

      return reply.status(204).send();
    },
  );
};

export default commentsRoute;
