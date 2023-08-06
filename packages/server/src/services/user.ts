import { NotFound } from '../lib/httpError';
import prisma from '../lib/prisma';

const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new NotFound('user not found');
  }

  return user;
};

const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new NotFound('user not found');
  }

  return user;
};

export { findUserById, findUserByEmail };
