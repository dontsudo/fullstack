import {
  FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';

import { paginationQueryStringSchema } from '../../schemas/common';
import { getPosts } from '../../services/post';

const usersRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.get(
    '/users/:id/posts',
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
        querystring: paginationQueryStringSchema,
      },
    },
    async (request, reply) => {
      const userId = request.params.id;
      const { page, limit } = request.query;

      const posts = await getPosts(server)({
        where: {
          author: {
            _id: userId,
          },
        },
        page,
        limit,
      });

      return reply.status(200).send(posts);
    },
  );
};

export default usersRoute;
