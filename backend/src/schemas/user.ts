import { Type } from '@fastify/type-provider-typebox';

import { entitySchema } from './common';

export const userProfileSchema = Type.Composite([
  entitySchema,
  Type.Object({
    bio: Type.Optional(Type.String()),
  }),
]);

export const userSchema = Type.Composite([
  entitySchema,
  Type.Object({
    name: Type.String(),
    email: Type.String(),
    password: Type.String(),
    profile: Type.Optional(userProfileSchema),
  }),
]);

export const userWithoutPasswordSchema = Type.Omit(userSchema, ['password']);

export const userResponseSchema = userWithoutPasswordSchema;
