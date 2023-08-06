import Fastify, { FastifyServerOptions } from 'fastify';
import corsPlugin from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import config from './config';
import jwtPlugin from './plugins/jwt';
import errorHandler from './plugins/errorHandler';

import usersRouet from './routes/v1/users';
import authRoute from './routes/v1/auth';
import postsRoute from './routes/v1/posts';
import commentsRoute from './routes/v1/comments';

export const init = async (opts: FastifyServerOptions = {}) => {
  const server = Fastify(opts).withTypeProvider<TypeBoxTypeProvider>();

  await server.register(swagger, {
    swagger: {
      info: {
        title: 'fullstack.backend.api',
        version: '0.0.1',
      },
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  });

  await server.register(swaggerUI, {
    routePrefix: '/docs',
  });

  server.register(corsPlugin);
  server.register(jwtPlugin, {
    secret: config.JWT_SECRET,
    sign: {
      expiresIn: config.JWT_EXPIRES_IN,
    },
  });

  server
    .register(usersRouet, { prefix: '/v1' })
    .register(authRoute, { prefix: '/v1' })
    .register(postsRoute, { prefix: '/v1' })
    .register(commentsRoute, { prefix: '/v1' });

  server.setErrorHandler(errorHandler);

  return server;
};
