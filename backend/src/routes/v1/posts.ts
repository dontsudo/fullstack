import {
  FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';

import {
  createPostBodySchema,
  postParamsSchema,
  updatePostBodySchema,
} from '../../schemas/post';
import { paginationQueryStringSchema } from '../../schemas/common';
import {
  createPost,
  deletePost,
  findPostById,
  findPosts,
  updatePost,
} from '../../services/post';

const postsRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.post(
    '/posts',
    {
      schema: {
        body: createPostBodySchema,
        security: [{ bearerAuth: [] }],
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      await createPost(request.body, request.user.id);

      return reply.status(201).send();
    },
  );

  server.get(
    '/posts',
    {
      schema: {
        querystring: paginationQueryStringSchema,
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query;

      const posts = await findPosts({
        page,
        limit,
      });

      return reply.send(posts);
    },
  );

  server.get(
    '/posts/:postId',
    {
      schema: {
        params: Type.Object({
          postId: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const post = await findPostById(request.params.postId);

      return reply.send(post);
    },
  );

  server.patch(
    '/posts/:postId',
    {
      schema: {
        params: postParamsSchema,
        body: updatePostBodySchema,
        security: [{ bearerAuth: [] }],
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const updated = await updatePost(
        request.params.postId,
        request.body,
        request.user.id,
      );

      return reply.send(updated);
    },
  );

  server.delete(
    '/posts/:postId',
    {
      schema: {
        params: postParamsSchema,
        security: [{ bearerAuth: [] }],
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      await deletePost(request.params.postId, request.user.id);

      return reply.status(204).send();
    },
  );
};

export default postsRoute;
