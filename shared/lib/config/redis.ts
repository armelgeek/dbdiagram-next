import { createClient } from 'redis';

// Create a mock Redis client for development if no Redis URL is provided
const createRedisClient = () => {
  if (!process.env.CACHE_URL) {
    console.warn('No CACHE_URL provided, using mock Redis client');
    return {
      get: async () => null,
      set: async () => 'OK',
      del: async () => 1,
      exists: async () => 0,
      expire: async () => 1,
      flushall: async () => 'OK',
      on: () => ({ connect: () => Promise.resolve() }),
      connect: () => Promise.resolve(),
      disconnect: () => Promise.resolve(),
    };
  }

  return createClient({
    url: process.env.CACHE_URL,
  })
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect();
};

export const redis = await createRedisClient();
