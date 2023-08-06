import { Type, TSchema } from '@fastify/type-provider-typebox';
export const EntitySchema = Type.Object({
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

export const PaginationQueryStringSchema = Type.Object({
  page: Type.Integer({
    default: 1,
  }),
  limit: Type.Integer({
    default: 10,
  }),
});

export const PaginationResponseSchema = <T extends TSchema>(t: T) =>
  Type.Object({
    data: Type.Array(t),
    hasMore: Type.Boolean(),
  });

export const ErrorResponseSchema = Type.Object({
  status: Type.Integer(),
  message: Type.String(),
});
