import { Type } from '@fastify/type-provider-typebox';

export const entitySchema = Type.Object({
  id: Type.String(),
  createdAt: Type.Unsafe<Date>({
    type: 'string',
    format: 'date-format',
  }),
  updatedAt: Type.Unsafe<Date>({
    type: 'string',
    format: 'date-format',
  }),
});

export const paginationQueryStringSchema = Type.Object({
  page: Type.Integer({
    default: 1,
  }),
  limit: Type.Integer({
    default: 10,
  }),
});

export const errorResponseSchema = Type.Object({
  status: Type.Integer(),
  message: Type.String(),
});
