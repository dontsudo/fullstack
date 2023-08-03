import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import bcrypt from 'bcrypt';

import { createUser, findUserByEmail } from '../../../services/user';
import { authLocalBodySchema, authResponseSchema } from './schema';
import { errorResponseSchema } from '../../common';

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

      const user = await findUserByEmail(server)(email);
      if (user) {
        return reply.code(409).send({
          status: 409,
          message: 'user already exists',
        });
      }

      const newUser = await createUser(server)({
        email,
        password,
      });

      const accessToken = await reply.jwtSign({
        id: newUser.id,
        email: newUser.email,
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
        return reply
          .code(401)
          .send({ status: 401, message: 'invalid crednetials' });
      }

      const valid = await bcrypt.compare(password, user.hashedPassword);
      if (!valid) {
        return reply
          .code(401)
          .send({ status: 401, message: 'invalid crednetials' });
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
