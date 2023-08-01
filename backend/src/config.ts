import { envSchema } from 'env-schema';
import { Static, Type } from '@sinclair/typebox';

const schema = Type.Object({
  NODE_ENV: Type.Optional(
    Type.String({
      default: 'development',
    }),
  ),
  PORT: Type.Optional(
    Type.Number({
      default: 8080,
    }),
  ),

  // db config
  MONGO_DB_URI: Type.String({
    default: 'mongodb://localhost:27017',
  }),
  MONGO_DB_USER: Type.String({
    default: 'root',
  }),
  MONGO_DB_PASS: Type.String({
    default: 'example',
  }),

  // jwt config
  JWT_SECRET: Type.String({
    default: 'secret',
  }),
  JWT_EXPIRES_IN: Type.String({
    default: '1h',
  }),
});

type Schema = Static<typeof schema>;

export const config = envSchema<Schema>({
  schema,
});
