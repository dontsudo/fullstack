import Fastify, { FastifyServerOptions } from 'fastify';
import corsPlugin from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { dbPlugin, jwtPlugin } from './plugins';
import { config } from './config';
import userRoute from './routes/v1/user';
import authRoute from './routes/v1/auth';
import postRoute from './routes/v1/post';

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

  server
    .register(corsPlugin)
    .register(jwtPlugin, {
      secret: config.JWT_SECRET,
      sign: {
        expiresIn: config.JWT_EXPIRES_IN,
      },
    })
    .register(dbPlugin);

  server
    .register(userRoute, { prefix: '/v1' })
    .register(authRoute, { prefix: '/v1' })
    .register(postRoute, { prefix: '/v1' });

  return server;
};
