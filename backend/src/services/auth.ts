import bcrypt from 'bcrypt';

import prisma from '../lib/prisma';
import { HttpError } from '../lib/httpError';
import { RegisterLocal } from '../schemas/auth';

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

export { registerLocal };
