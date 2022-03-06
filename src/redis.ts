import { ISessionStorage } from '@vk-io/session';
import * as Redis from 'ioredis';

export type IRedisStorageOptions = Redis.RedisOptions;
// | {
//       host?: Redis.RedisOptions['host'];
//       port?: Redis.RedisOptions['port'];
//       password?: Redis.RedisOptions['password'];
//       keyPrefix?: Redis.RedisOptions['keyPrefix'];
//   };

export class RedisStorage implements ISessionStorage {
    public readonly redis: Redis.Redis;

    constructor(redis_or_options?: IRedisStorageOptions | [Redis.Redis]) {
        if (Array.isArray(redis_or_options)) {
            if (!(redis_or_options[0] instanceof Redis)) {
                throw new TypeError('An instance of the Redis class was expected');
            }
            [this.redis] = redis_or_options;
        } else {
            this.redis = new Redis({
                ...redis_or_options,
                keyPrefix: redis_or_options?.keyPrefix || 'vk-io:session:',
            });
        }
    }

    public async get(key: string): Promise<object | undefined> {
        return JSON.parse((await this.redis.get(key)) || '{}');
    }

    public async set(key: string, value: object): Promise<boolean> {
        return (await this.redis.set(key, JSON.stringify(value))) === 'OK';
    }

    public async delete(key: string): Promise<boolean> {
        return (await this.redis.del(key)) === 1;
    }

    public async touch(_key: string): Promise<void> {
        // await this.redis
    }
}
