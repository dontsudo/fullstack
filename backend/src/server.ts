import Fastify, { FastifyServerOptions } from 'fastify';
import corsPlugin from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { HttpError } from './lib/httpError';
import { config } from './config';

import dbPlugin from './plugins/db';
import jwtPlugin from './plugins/jwt';
import indexRoute from './routes/v1/';
import authRoute from './routes/v1/auth';
import postsRoute from './routes/v1/posts';
import usersRoute from './routes/v1/users';
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
  server.register(dbPlugin);

  server
    .register(indexRoute, { prefix: '/v1' })
    .register(authRoute, { prefix: '/v1' })
    .register(postsRoute, { prefix: '/v1' })
    .register(commentsRoute, { prefix: '/v1' })
    .register(usersRoute, { prefix: '/v1' });

  server.setErrorHandler(async (error, _, reply) => {
    server.log.error(error); // Log error to stdout 🤔

    if (error instanceof HttpError) {
      return reply.status(error.status).send({
        status: error.status,
        message: error.message,
      });
    }

    return reply.status(500).send({
      status: 500,
      message: 'internal server error',
    });
  });

  return server;
};
