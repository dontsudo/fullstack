import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';

import { User } from '../models/User';

export const findUserById = (server: FastifyInstance) => {
  const userModel = server.store.User;

  return async (id: string): Promise<User | null> => {
    const user = await userModel.findById(id);

    return user;
  };
};

export const findUserByEmail = (server: FastifyInstance) => {
  const userModel = server.store.User;

  return async (email: string): Promise<User | null> => {
    const user = await userModel.findOne({
      email,
    });

    return user;
  };
};

export const createUser = (server: FastifyInstance) => {
  const userModel = server.store.User;

  return async ({ email, password }): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email,
      hashedPassword,
    });

    return user;
  };
};
