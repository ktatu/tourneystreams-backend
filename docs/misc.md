If you plan on doing more than local development with the app, then create new applications in Twitch developer as needed, for example one for local use, one for deployment etc.

### Setting up redis

My recommendation is to use [redis-stack](https://hub.docker.com/r/redis/redis-stack) running in container for local development. [Redis JSON-module](https://redis.io/docs/data-types/json/) is required for running the backend, so make sure that whatever solution you choose has it enabled or available for installation.

The redis-stack image and Redis Cloud both have the JSON-module enabled by default.

These redis repositories' READMEs might help with understanding how to run redis-stack in a container: [1](https://github.com/redis/redis-om-node#connect-to-redis-with-node-redis), [2](https://github.com/redis/node-redis#usage)
