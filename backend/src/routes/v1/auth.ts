import bcrypt from 'bcrypt';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import { findUserByEmail } from '../../services/user';
import { registerLocal } from '../../services/auth';
import {
  registerLocalBodySchema,
  authResponseSchema,
  loginLocalBodySchema,
} from '../../schemas/auth';
import { errorResponseSchema } from '../../schemas/common';
import { InvalidCredentials } from '../../lib/httpError';

const authRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  server.post(
    '/auth/local/register',
    {
      schema: {
        body: registerLocalBodySchema,
        response: {
          201: authResponseSchema,
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
        body: loginLocalBodySchema,
        response: {
          201: authResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await findUserByEmail(email);
      if (!user) {
        throw new InvalidCredentials('invalid credentials');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new InvalidCredentials('invalid credentials');
      }

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
