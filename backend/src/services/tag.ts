import { FastifyInstance } from 'fastify';

export const upsertTags = (server: FastifyInstance) => {
  const tagModel = server.store.Tag;

  return async (tags?: string[]) => {
    if (!tags) return [];

    return Promise.all(
      tags.map(async (tag) => {
        let foundTag = await tagModel.findOne({ name: tag });
        return foundTag ?? (await tagModel.create({ name: tag }));
      }),
    );
  };
};
