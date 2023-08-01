import fp from 'fastify-plugin';
import {
  Type,
  FastifyPluginAsyncTypebox,
} from '@fastify/type-provider-typebox';
import bcrypt from 'bcrypt';

import { UserRepository } from '../repository/user';

const authRoute: FastifyPluginAsyncTypebox = async (server, _) => {
  const userRepository = UserRepository(server);

  server.post(
    '/auth/local/register',
    {
      schema: {
        body: Type.Object({
          email: Type.String(),
          password: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await userRepository.findByEmail(email);
      if (user) {
        return reply.code(409).send({
          message: 'user already exists',
        });
      }

      const newUser = await userRepository.create({
        email,
        password,
      });

      const accessToken = await reply.jwtSign({
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
        body: Type.Object({
          email: Type.String(),
          password: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await userRepository.findByEmail(email);
      if (!user) {
        return reply.code(401).send({
          message: 'invalid crednetials',
        });
      }

      const valid = await bcrypt.compare(password, user.hashedPassword);
      if (!valid) {
        return reply.code(401).send({
          message: 'invalid crednetials',
        });
      }

      const accessToken = await reply.jwtSign({
        email: user.email,
      });

      return reply.code(201).send({
        accessToken,
      });
    },
  );
};

export default fp(authRoute);
