import fp from 'fastify-plugin';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import mongoose from 'mongoose';

import { config } from '../config';
import { userSchema } from '../models/user';
import { postSchema } from '../models/post';
import { commentSchema } from '../models/comment';

const dbPlugin: FastifyPluginAsyncTypebox = async (server, _) => {
  const conn = await mongoose.connect(config.MONGO_DB_URI, {
    user: config.MONGO_DB_USER,
    pass: config.MONGO_DB_PASS,
  });

  server.decorate('store', {
    User: conn.model('User', userSchema),
    Post: conn.model('Post', postSchema),
    Comment: conn.model('Comment', commentSchema),
    db: conn,
  });

  server.addHook('onClose', async () => {
    await mongoose.disconnect();
  });
};

export default fp(dbPlugin);
