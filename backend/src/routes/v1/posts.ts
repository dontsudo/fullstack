import {
  FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';

import {
  createPostBodySchema,
  postListResponseSchema,
  postResponseSchema,
  updatePostBodySchema,
} from '../../schemas/post';
import {
  createPost,
  getPostById,
  findPostAndDelete,
  findPostAndUpdate,
  getPosts,
} from '../../services/post';
import { JwtUserPayload } from '../../plugins/jwt';
import {
  errorResponseSchema,
  paginationQueryStringSchema,
} from '../../schemas/common';
import { NotFoundError } from '../../lib/httpError';
import { Post } from '../../models/post';

const postsRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.get(
    '/posts',
    {
      schema: {
        querystring: paginationQueryStringSchema,
        response: {
          200: postListResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query;

      const posts = await getPosts(server)({
        limit,
        page,
      });

      return reply.send(posts.map(transformPostResponse));
    },
  );

  server.get(
    '/posts/:postId',
    {
      schema: {
        params: Type.Object({
          postId: Type.String(),
        }),
        response: {
          200: postResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { postId } = request.params;

      const post = await getPostById(server)(postId);
      if (!post) {
        throw new NotFoundError('post not found');
      }

      return reply.send(transformPostResponse(post));
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

      return reply.status(201).send();
    },
  );

  server.patch(
    '/posts/:postId',
    {
      schema: {
        params: Type.Object({
          postId: Type.String(),
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
      const { postId } = request.params;
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
        throw new NotFoundError('post not found');
      }

      return reply.send(transformPostResponse(updatedPost));
    },
  );

  server.delete(
    '/posts/:postId',
    {
      schema: {
        params: Type.Object({
          postId: Type.String(),
        }),
        response: {
          404: errorResponseSchema,
        },
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const user = request.user as JwtUserPayload;
      const postId = request.params.postId;

      const deletedPost = await findPostAndDelete(server)({
        _id: postId,
        author: user.id,
      });
      if (!deletedPost) {
        throw new NotFoundError('post not found');
      }

      return reply.status(204).send();
    },
  );
};

export default postsRoute;

const transformPostResponse = (post: Post) => ({
  ...post.toObject(),
  tags: post.tags.map((tag) => tag.name),
});
