import fp from 'fastify-plugin';
import mongoose from 'mongoose';

import { config } from '../config';
import { UserSchema } from '../models/User';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

const dbPlugin: FastifyPluginAsyncTypebox = async (server, _) => {
  const conn = await mongoose.connect(config.MONGO_DB_URI, {
    user: config.MONGO_DB_USER,
    pass: config.MONGO_DB_PASS,
  });

  server.decorate('store', {
    User: conn.model('User', UserSchema),
    db: conn,
  });

  server.addHook('onClose', async () => {
    await mongoose.disconnect();
  });
};

export default fp(dbPlugin);
