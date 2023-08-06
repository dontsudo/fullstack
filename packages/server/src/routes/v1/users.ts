import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import { findUserById } from '../../services/user';
import { UserWithoutPasswordSchema } from '../../schema/user';

const usersRouet: FastifyPluginAsyncTypebox = async (server, _) => {
  server.get(
    '/users/me',
    {
      schema: {
        response: {
          200: UserWithoutPasswordSchema,
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

export default usersRouet;
