import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import { userResponseSchema } from './schema';
import { findUserByEmail } from '../../../services/user';
import { JwtUserPayload } from '../../../plugins/jwt';
import { errorResponseSchema } from '../../common';
import { NotFoundException } from '../../../lib/http-exception';

const userRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.get(
    '/user/me',
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
        throw new NotFoundException('User not found');
      }

      return reply.status(200).send(me);
    },
  );
};

export default userRoute;
