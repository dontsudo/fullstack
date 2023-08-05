import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import { userResponseSchema } from '../../schemas/user';
import { errorResponseSchema } from '../../schemas/common';
import { JwtUserPayload } from '../../plugins/jwt';
import { findUserByEmail } from '../../services/user';
import { NotFoundError } from '../../lib/httpError';

const indexRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.get(
    '/me',
    {
      schema: {
        response: {
          200: userResponseSchema,
          401: errorResponseSchema,
        },
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const user = request.user as JwtUserPayload;

      const me = await findUserByEmail(server)(user.email);
      if (!me) {
        throw new NotFoundError('User not found');
      }

      return reply.status(200).send(me);
    },
  );
};

export default indexRoute;
