import { init } from './server';
import { config } from './config';

const main = async () => {
  const server = await init({
    logger: {
      level: 'debug',
      transport: {
        target: 'pino-pretty',
      },
    },
  });

  server.listen(
    {
      port: config.PORT,
    },
    (err) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
    },
  );
};

main();
