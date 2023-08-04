import { Type } from '@fastify/type-provider-typebox';

export const tagNameSchema = Type.String({ minLength: 1, maxLength: 32 });
export const tagSchema = Type.Object({ name: tagNameSchema });

export const createTagBodySchema = tagNameSchema;
export const createTagListBodySchema = Type.Array(createTagBodySchema);
