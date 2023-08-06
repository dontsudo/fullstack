import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpError } from '../lib/httpError';

const errorHandler = (
  error: HttpError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  request.log.error(error);

  if ('statusCode' in error) {
    return reply.status(error.statusCode).send({
      status: error.statusCode,
      message: error.message,
    });
  }

  return reply.status(500).send({
    status: 500,
    message: 'internal server error',
  });
};

export default errorHandler;
