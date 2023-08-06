import { Type } from '@fastify/type-provider-typebox';
import { EntitySchema } from './common';

export const UserProfileSchema = Type.Composite([
  EntitySchema,
  Type.Object({
    bio: Type.Optional(Type.String()),
  }),
]);

export const UserSchema = Type.Composite([
  EntitySchema,
  Type.Object({
    name: Type.String(),
    email: Type.String(),
    password: Type.String(),
    profile: Type.Optional(UserProfileSchema),
  }),
]);

export const UserWithoutPasswordSchema = Type.Omit(UserSchema, ['password']);

export const UserResponseSchema = UserWithoutPasswordSchema;
