import fp from 'fastify-plugin';
import { FastifyPluginAsync, RouteHandlerMethod } from 'fastify';
import jwt, { FastifyJWTOptions } from '@fastify/jwt';

import { InvalidCredentials } from '../lib/httpError';

export type JwtUserPayload = {
  id: string;
  email: string;
};

const jwtPlugin: FastifyPluginAsync<FastifyJWTOptions> = async (server, opts) => {
  server.register(jwt, opts);
  server.decorate('authenticate', (async (request, _) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      server.log.error(error);
      throw new InvalidCredentials('invalid credentials');
    }
  }) as RouteHandlerMethod);
};

export default fp(jwtPlugin, { name: 'jwtPlugin' });
