import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import {
  createCommentBodySchema,
  createCommentParamSchema,
} from '../../schemas/comment';

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
      const userId = request.user.id;

      const { postId } = request.params;
      const { content } = request.body;

      return reply.status(201).send();
    },
  );
};

export default commentsRoute;
