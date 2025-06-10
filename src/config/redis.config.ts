// config/redis.config.ts
import { registerAs } from '@nestjs/config';
import 'dotenv/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  ttl: parseInt(process.env.REDIS_TTL || '3600', 10), // default 1 hour
}));
