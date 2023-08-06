import { envSchema } from 'env-schema';
import { Static, Type } from '@sinclair/typebox';

const schema = Type.Object({
  // server config
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

  // db config (for `prisma`)
  DATABASE_URL: Type.String({
    default: 'postgresql://postgres:postgres@localhost:5432/mydb?schema=public',
    description: 'PostgreSQL database url',
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

const config = envSchema<Schema>({
  schema,
});

export default config;
