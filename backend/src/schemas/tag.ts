import { Type } from '@fastify/type-provider-typebox';
import { entitySchema } from './common';

export const tagNameSchema = Type.String({
  minLength: 1,
  maxLength: 32,
});

export const tagSchema = Type.Composite([
  Type.Object({
    name: tagNameSchema,
  }),
  entitySchema,
]);

export const createTagBodySchema = tagNameSchema;

export const createTagListBodySchema = Type.Array(createTagBodySchema);
