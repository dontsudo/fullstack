import { FastifyReply, FastifyRequest } from 'fastify';

export const errorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  request.log.error(error);

  if ('statusCode' in error) {
    return reply.status(error.statusCode as number).send({
      status: error.statusCode,
      message: error.message,
    });
  }

  return reply.status(500).send({
    status: 500,
    message: 'internal server error',
  });
};
