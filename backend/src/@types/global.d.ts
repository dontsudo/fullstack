import mongoose from 'mongoose';

import type { User } from '../schema';

declare module 'fastify' {
  export interface FastifyInstance {
    store: {
      User: mongoose.Model<User>;
      db: typeof mongoose;
    };
    authenticate: RouteHandlerMethod;
  }
}
