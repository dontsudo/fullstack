import {
  Type,
  FastifyPluginAsyncTypebox,
} from '@fastify/type-provider-typebox';

import { findUserByEmail } from '../../services/user';
import { JwtUserPayload } from '../../plugins/jwt';

const userRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.get(
    '/user/me',
    {
      schema: {
        response: {
          200: Type.Object({
            email: Type.String(),
          }),
          401: Type.Object({
            message: Type.String(),
          }),
        },
      },
      onRequest: [server.authenticate],
    },
    async (request, reply) => {
      const user = request.user as JwtUserPayload;

      const me = await findUserByEmail(server)(user.email);
      if (!me) {
        return reply.code(401).send({
          message: 'user not found',
        });
      }

      server.log.debug('🤔 Who am I?', me);
      return reply.send(me);
    },
  );
};

export default userRoute;
