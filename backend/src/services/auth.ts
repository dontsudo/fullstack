import { FastifyInstance } from 'fastify';
import { findUserByEmail } from './user';
import { HttpException } from '../lib/http-exception';

export const registerUser = (server: FastifyInstance) => {
  const userModel = server.store.User;

  return async (email: string, password: string) => {
    const user = await findUserByEmail(server)(email);
    if (user) {
      throw new HttpException(401, 'user already exists');
    }

    const newUser = await userModel.create({
      email: email,
      password: password,
    });

    return newUser;
  };
};
