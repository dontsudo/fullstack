import {
  FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';

import {
  createPostBodySchema,
  postListResponseSchema,
  postResponseSchema,
  postSchema,
  updatePostBodySchema,
} from '../../../schemas/post';
import {
  createPost,
  getPostById,
  findPostAndDelete,
  findPostAndUpdate,
  getPosts,
} from '../../../services/posts';
import { JwtUserPayload } from '../../../plugins/jwt';
import {
  errorResponseSchema,
  paginationQueryStringSchema,
} from '../../../schemas/common';
import { NotFoundException } from '../../../lib/http-exception';
import { Post } from '../../../models/post';

const transformPostResponse = (post: Post) => ({
  ...post.toObject(),
  tags: post.tags.map((tag) => tag.name),
});

const postsRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.get(
    '/posts',
    {
      schema: {
        querystring: paginationQueryStringSchema,
        response: {
          200: postListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query;

      const posts = await getPosts(server)({
        limit,
        page,
      });

      return reply.send(posts.map((post) => transformPostResponse(post)));
    },
  );

  server.get(
    '/posts/:id',
    {
      schema: {
        params: Type.Object({ id: Type.String() }),
        response: {
          200: postSchema,
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const post = await getPostById(server)(id);
      if (!post) {
        throw new NotFoundException('post not found');
      }

      return reply.status(200).send(transformPostResponse(post));
    },
  );

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
      const user = request.user as JwtUserPayload;
      const { title, content, tags } = request.body;

      const post = await createPost(server)({
        title,
        content,
        tags,
        author: user.id,
      });

      return reply.status(201).send(transformPostResponse(post));
    },
  );

  server.patch(
    '/posts/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
        body: updatePostBodySchema,
        response: {
          200: postResponseSchema,
          404: errorResponseSchema,
        },
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
        throw new NotFoundException('post not found');
      }

      return reply.send(transformPostResponse(updatedPost));
    },
  );

  server.delete(
    '/posts/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
        response: {
          404: errorResponseSchema,
        },
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
        throw new NotFoundException('post not found');
      }

      return reply.status(204).send();
    },
  );
};

export default postsRoute;
