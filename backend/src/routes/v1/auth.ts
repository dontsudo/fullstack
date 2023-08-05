import bcrypt from 'bcrypt';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import { findUserByEmail } from '../../services/user';
import { authLocalBodySchema, authResponseSchema } from '../../schemas/auth';
import { errorResponseSchema } from '../../schemas/common';
import { register } from '../../services/auth';
import { InvalidCredentialsError } from '../../lib/httpError';

const authRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.post(
    '/auth/local/register',
    {
      schema: {
        body: authLocalBodySchema,
        response: {
          201: authResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await register(server)(email, password);

      const accessToken = await reply.jwtSign({
        id: user._id,
        email: user.email,
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
        body: authLocalBodySchema,
        response: {
          201: authResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await findUserByEmail(server)(email);
      if (!user) {
        throw new InvalidCredentialsError('invalid credentials');
      }

      const valid = await bcrypt.compare(password, user.hashedPassword);
      if (!valid) {
        throw new InvalidCredentialsError('invalid credentials');
      }

      const accessToken = await reply.jwtSign({
        id: user._id,
        email: user.email,
      });

      return reply.code(201).send({
        accessToken,
      });
    },
  );
};

export default authRoute;
