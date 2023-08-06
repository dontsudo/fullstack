import {
  FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';

import {
  CreatePostBodySchema,
  PostParamsSchema,
  PostSchema,
  UpdatePostBodySchema,
} from '../../schema/post';
import {
  PaginationQueryStringSchema,
  PaginationResponseSchema,
} from '../../schema/common';
import {
  createPost,
  removePost,
  findPostById,
  findPosts,
  updatePost,
} from '../../services/post';

const postsRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.post(
    '/posts',
    {
      schema: {
        body: CreatePostBodySchema,
        response: {
          201: Type.Undefined(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      await createPost(request.body, request.user.id);

      reply.status(201).send();
    },
  );

  server.get(
    '/posts',
    {
      schema: {
        querystring: PaginationQueryStringSchema,
        response: {
          200: PaginationResponseSchema(PostSchema),
        },
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query;

      const { data, hasMore } = await findPosts({
        page,
        limit,
      });

      reply.status(200).send({
        data,
        hasMore,
      });
    },
  );

  server.get(
    '/posts/:postId',
    {
      schema: {
        params: PostParamsSchema,
      },
    },
    async (request, reply) => {
      const post = await findPostById(request.params.postId);

      reply.send(post);
    },
  );

  server.patch(
    '/posts/:postId',
    {
      schema: {
        params: PostParamsSchema,
        body: UpdatePostBodySchema,
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

      reply.send(updated);
    },
  );

  server.delete(
    '/posts/:postId',
    {
      schema: {
        params: PostParamsSchema,
        security: [{ bearerAuth: [] }],
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      await removePost(request.params.postId, request.user.id);

      reply.status(204).send();
    },
  );
};

export default postsRoute;
