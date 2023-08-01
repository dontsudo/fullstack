import fp from 'fastify-plugin';
import { FastifyPluginAsync, RouteHandlerMethod } from 'fastify';
import jwt, { FastifyJWTOptions } from '@fastify/jwt';

const jwtPlugin: FastifyPluginAsync<FastifyJWTOptions> = async (
  server,
  opts,
) => {
  server.register(jwt, opts);
  server.decorate('authenticate', (async (request, _) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }) as RouteHandlerMethod);
};

export default fp(jwtPlugin, { name: 'jwtPlugin' });
