const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  if (redisClient) return redisClient;

  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Conectado ao Redis');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.warn('⚠️  Redis não disponível, cache desabilitado:', error.message);
    return null;
  }
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };

