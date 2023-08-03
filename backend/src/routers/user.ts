import fp from 'fastify-plugin';
import {
  Type,
  FastifyPluginAsyncTypebox,
} from '@fastify/type-provider-typebox';
import { findUserByEmail } from '../services/user';

type JwtUserPayload = {
  email: string;
};

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
      const { email } = request.user as JwtUserPayload;

      const me = await findUserByEmail(server)(email);
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

export default fp(userRoute);
