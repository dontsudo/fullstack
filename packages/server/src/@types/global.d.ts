import type { JwtUserPayload } from '../plugins/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: RouteHandlerMethod;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string };
    user: { id: string };
  }
}
