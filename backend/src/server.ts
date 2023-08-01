import Fastify, { FastifyServerOptions } from 'fastify';
import corsPlugin from '@fastify/cors';
import swagger from '@fastify/swagger';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import dbPlugin from './plugins/db';
import jwtPlugin from './plugins/jwt';
import authRoute from './routers/auth';
import userRoute from './routers/user';
import { config } from './config';

export const init = async (opts: FastifyServerOptions = {}) => {
  const server = Fastify(opts).withTypeProvider<TypeBoxTypeProvider>();

  await server.register(swagger, {
    swagger: {
      info: {
        title: 'backend.api',
        version: '0.0.1',
      },
    },
  });
  server.register(corsPlugin);
  server.register(jwtPlugin, {
    secret: config.JWT_SECRET,
    sign: {
      expiresIn: config.JWT_EXPIRES_IN,
    },
  });
  server.register(dbPlugin);

  server.register(authRoute).register(userRoute);

  return server;
};
