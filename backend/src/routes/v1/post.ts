import {
  FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';

import {
  createPost,
  findPost,
  findPostAndDelete,
  findPostAndUpdate,
  findPosts,
} from '../../services/post';
import type { JwtUserPayload } from '../../plugins/jwt';

const postRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.get(
    '/post',
    {
      schema: {
        querystring: Type.Object({
          page: Type.Integer({
            default: 1,
          }),
          limit: Type.Integer({
            default: 10,
          }),
        }),
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query;

      const posts = await findPosts(server)({
        page,
        limit,
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
      },
    },
    async (request, reply) => {
      const postId = request.params.id;

      const post = await findPost(server)({
        _id: postId,
      });
      if (!post) {
        return reply.status(404).send({
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
        body: Type.Object({
          title: Type.String(),
          content: Type.String(),
        }),
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
        body: Type.Object({
          title: Type.Optional(Type.String()),
          content: Type.Optional(Type.String()),
        }),
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const user = request.user as JwtUserPayload;

      const postId = request.params.id;
      const { title, content } = request.body;

      const updatedPost = await findPostAndUpdate(server)(
        {
          _id: postId,
          author: user.id,
        },
        {
          title,
          content,
        },
      );
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
