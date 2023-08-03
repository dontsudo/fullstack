import {
  FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';

import {
  createPostBodySchema,
  postSchema,
  updatePostBodySchema,
} from './schema';
import {
  createPost,
  findPost,
  findPostAndDelete,
  findPostAndUpdate,
  findPosts,
} from '../../../services/post';
import type { JwtUserPayload } from '../../../plugins/jwt';
import { errorResponseSchema, paginationQueryStringSchema } from '../../common';

const postRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.get(
    '/post',
    {
      schema: {
        querystring: paginationQueryStringSchema,
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query;

      const posts = await findPosts(server)({
        limit,
        page,
      });

      return reply.send(posts);
    },
  );

  server.get(
    '/post/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
        response: {
          200: postSchema,
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const postId = request.params.id;

      const post = await findPost(server)({
        where: {
          _id: postId,
        },
      });
      if (!post) {
        return reply.status(404).send({
          status: 404,
          message: 'post not found',
        });
      }

      return reply.send(post);
    },
  );

  server.post(
    '/post',
    {
      schema: {
        body: createPostBodySchema,
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const user = request.user as JwtUserPayload;
      const { title, content } = request.body;

      const post = await createPost(server)({
        author: user.id,
        title,
        content,
      });

      return reply.status(201).send(post);
    },
  );

  server.patch(
    '/post/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
        body: updatePostBodySchema,
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const user = request.user as JwtUserPayload;
      const postId = request.params.id;
      const { title, content } = request.body;

      const updatedPost = await findPostAndUpdate(server)({
        data: {
          title,
          content,
        },
        where: {
          _id: postId,
          author: user.id,
        },
      });
      if (!updatedPost) {
        return reply.status(404).send({
          message: 'post not found',
        });
      }

      return reply.send(updatedPost);
    },
  );

  server.delete(
    '/post/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const user = request.user as JwtUserPayload;
      const postId = request.params.id;

      const deletedPost = await findPostAndDelete(server)({
        _id: postId,
        author: user.id,
      });
      if (!deletedPost) {
        return reply.status(404).send({
          message: 'post not found',
        });
      }

      return reply.status(204).send();
    },
  );
};

export default postRoute;
