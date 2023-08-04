import {
  FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';

const usersRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.get(
    '/users/:id/posts',
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
      },
    },
    async (request, reply) => {},
  );
};

export default usersRoute;
