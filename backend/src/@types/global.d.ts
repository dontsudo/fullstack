import mongoose from 'mongoose';

import { User } from '../models/User';
import { Post } from '../models/Post';

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
