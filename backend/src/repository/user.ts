import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { User } from '../models/User';

export const UserRepository = (server: FastifyInstance) => {
  const userModel = server.store.User;

  const findById = async (id: string): Promise<User | null> => {
    const user = await userModel.findById(id);

    return user;
  };

  const findByEmail = async (email: string): Promise<User | null> => {
    const user = await userModel.findOne({
      email,
    });

    return user;
  };

  const create = async ({ email, password }): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email,
      hashedPassword,
    });

    return user;
  };

  return {
    findById,
    findByEmail,
    create,
  };
};
