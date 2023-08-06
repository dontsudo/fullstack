
import bcrypt from 'bcrypt';

import prisma from '../lib/prisma';
import { HttpError } from '../lib/httpError';
import { RegisterLocal } from '../schema';

const registerLocal = async ({ name, email, password }: RegisterLocal) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    throw new HttpError(401, 'user already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
};

const verifyPassword = async (password: string, hashedPassword: string) => {
  const isPasswordMatched = await bcrypt.compare(password, hashedPassword);
  if (!isPasswordMatched) {
    throw new HttpError(
      401,
      'The username/email and password combination provided was incorrect.',
    );
  }
};

export { registerLocal, verifyPassword };
