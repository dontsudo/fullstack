import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import { findUserById } from '../../services/user';
import { userWithoutPasswordSchema } from '../../schemas/user';

const indexRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.get(
    '/me',
    {
      schema: {
        response: {
          200: userWithoutPasswordSchema,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const user = await findUserById(request.user.id);

      reply.status(200).send(user);
    },
  );
};

export default indexRoute;
