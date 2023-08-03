import mongoose from 'mongoose';

import { User } from '../models/user';
import { Post } from '../models/post';

declare module 'fastify' {
  export interface FastifyInstance {
    store: {
      User: mongoose.Model<User>;
      Post: mongoose.Model<Post>;
      db: typeof mongoose;
    };
    authenticate: RouteHandlerMethod;
  }
}
