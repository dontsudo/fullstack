import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import { findUserByEmail } from '../../services/user';
import { registerLocal, verifyPassword } from '../../services/auth';
import { AuthResponseSchema, ErrorResponseSchema, LoginLocalBodySchema, RegisterLocalBodySchema } from '../../schema';

const authRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.post(
    '/auth/local/register',
    {
      schema: {
        body: RegisterLocalBodySchema,
        response: {
          201: AuthResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const user = await registerLocal({
        name,
        email,
        password,
      });

      const accessToken = await reply.jwtSign({
        id: user.id,
      });

      return reply.code(201).send({
        accessToken,
      });
    },
  );

  server.post(
    '/auth/local/login',
    {
      schema: {
        body: LoginLocalBodySchema,
        response: {
          201: AuthResponseSchema,
          409: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await findUserByEmail(email);
      await verifyPassword(password, user.password);

      const accessToken = await reply.jwtSign({
        id: user.id,
      });

      return reply.code(201).send({
        accessToken,
      });
    },
  );
};

export default authRoute;
