# vk-io-redis-storage

[![NPM version][npm-v]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
<!-- [![Build Status][build]][build-url] -->

RedisStorage - Simple add-on for [Session](https://github.com/negezor/vk-io/tree/master/packages/session) [vk-io](https://github.com/negezor/vk-io) library

> Powered by [ioredis](https://github.com/luin/ioredis)

## Installation

### Yarn
```bash
yarn add vk-io-redis-storage
```

### NPM
```bash
npm i vk-io-redis-storage
```

### Example usage
```js
const { VK } = require('vk-io');
const { SessionManager } = require('@vk-io/session');
const { RedisStorage } = require('vk-io-redis-storage');

const vk = new VK({
    token: process.env.TOKEN
});

function startBot({ updates }) {
    // const storage = new RedisStorage([ioRedisClient]);
    const storage = new RedisStorage({ host: '127.0.0.1', keyPrefix: 'vk-io:session:' });

    const sessionManager = new SessionManager({
        storage,
        getStorageKey: (ctx) =>
            ctx.userId ? `${ctx.userId}_${ctx.userId}` : `${ctx.peerId}_${ctx.senderId}`,
    });

    updates.on('message', sessionManager.middleware);

    updates.hear('/counter', (ctx) => {
        if (ctx.isOutbox) return;

        const { session } = ctx;

        session.counter = (session.counter || 0) + 1;

        ctx.send(`You turned to the bot (${session.counter}) times`);
    });

    updates.start().catch(console.error);
}

// ...
startBot(vk);
```

[npm-v]: https://img.shields.io/npm/v/vk-io-redis-storage.svg?style=flat-square
[npm-downloads]: https://img.shields.io/npm/dt/vk-io-redis-storage?label=used%20by&style=flat-square
[npm-url]: https://www.npmjs.com/package/vk-io-redis-storage

[node]: https://img.shields.io/node/v/vk-io-redis-storage.svg?style=flat-square
[node-url]: https://nodejs.org

[build]: https://img.shields.io/travis/vk-io-redis-storage.svg?style=flat-square
[build-url]: https://travis-ci.org/vk-io-redis-storage
