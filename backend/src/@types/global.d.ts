import mongoose from 'mongoose';

import { User } from '../models/user';
import { Post } from '../models/post';
import { Comment } from '../models/comment';
import { Tag } from '../models/tag';

declare module 'fastify' {
  export interface FastifyInstance {
    store: {
      User: mongoose.Model<User>;
      Post: mongoose.Model<Post>;
      Tag: mongoose.Model<Tag>;
      Comment: mongoose.Model<Comment>;
      db: typeof mongoose;
    };
    authenticate: RouteHandlerMethod;
  }
}
