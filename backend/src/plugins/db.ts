import fp from 'fastify-plugin';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import mongoose from 'mongoose';

import { config } from '../config';
import { UserSchema } from '../models/User';
import { PostSchema } from '../models/Post';

const dbPlugin: FastifyPluginAsyncTypebox = async (server, _) => {
  const conn = await mongoose.connect(config.MONGO_DB_URI, {
    user: config.MONGO_DB_USER,
    pass: config.MONGO_DB_PASS,
  });

  server.decorate('store', {
    User: conn.model('User', UserSchema),
    Post: conn.model('Post', PostSchema),
    db: conn,
  });

  server.addHook('onClose', async () => {
    await mongoose.disconnect();
  });
};

export default fp(dbPlugin);
