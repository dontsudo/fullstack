import { FastifyInstance } from 'fastify';

import { findUserByEmail } from './user';
import { HttpError } from '../lib/httpError';
import { User } from '../models/user';

export const register = (server: FastifyInstance) => {
  const userModel = server.store.User;

  return async (email: string, password: string): Promise<User> => {
    const user = await findUserByEmail(server)(email);
    if (user) {
      throw new HttpError(401, 'user already exists');
    }

    return userModel.create({
      email: email,
      password: password,
    });
  };
};
