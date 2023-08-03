import mongoose from 'mongoose';

import type { User } from '../models/user';
import type { Post } from '../models/post';
import type { Comment } from '../models/comment';

declare module 'fastify' {
  export interface FastifyInstance {
    store: {
      User: mongoose.Model<User>;
      Post: mongoose.Model<Post>;
      Comment: mongoose.Model<Comment>;
      db: typeof mongoose;
    };
    authenticate: RouteHandlerMethod;
  }
}
