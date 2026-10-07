[![Build](https://github.com/ktatu/tourneystreams-backend/actions/workflows/ci_cd.yml/badge.svg)](https://github.com/ktatu/tourneystreams-backend/actions/workflows/ci_cd.yml)
[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/tkaq.svg)](https://uptime.betterstack.com/?utm_source=status_badge)

# tourneystreams-backend

For general information about the project, check out the [frontend repository](https://github.com/ktatu/tourneystreams-frontend)

## Local development

Don't use safari. The app uses secure cookies, which clashes with running on localhost, according to [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies#block_access_to_your_cookies)

For setting up environment variables, you can use .env_example as base. Remember to rename it to .env

Insert the following env variables:

- CLIENT_URL: where your frontend runs. This should be http://localhost:3000 by default.
- JWT_SECRET: a randomly generated string.

#### Twitch api

Follow the instructions on https://dev.twitch.tv/docs/authentication/register-app

1. When registering the application, use http://localhost:3001/twitch/redirect as the redirect URL. The form may initially say "https only", but it will accept localhost

2. In your application management page, there will be client ID, redirect url (same as above), and client secret. Save these in the keys TWITCH_CLIENT_ID, TWITCH_CALLBACK_URL and TWITCH_CLIENT_SECRET of the .env file

3. Make sure you have some channels followed for testing the app. The button is on the bottom-right of streams

#### YouTube api

Adding a YouTube api key can be safely skipped. The api is only used to match the livestreams added from the app bar with YouTube channel names. Not using the api results in video IDs being used as channel names.

- Follow steps 1-3 [here:](https://developers.google.com/youtube/v3/getting-started)

Alternatively, you can follow these instructions after you've created a project:

1. Go to Credentials page, the button should be on the left. You can also insert your project's name here to get there: https://console.cloud.google.com/apis/credentials?project=yourprojecthere-12345
2. Click "Create credentials" on top
3. Select "API key" in the dropdown selection
4. Select "YouTube Data API v3" in the API restrictions selection, and click create
5. Place the key in YOUTUBE_API_KEY in .env

#### Redis

The app requires the redis instance to have the [RedisJSON](https://github.com/RedisJSON/RedisJSON/tree/master) module installed. Any redis version above 8.0 should have it on by default. I personally use and would recommend [Redis Cloud](https://redis.io/cloud/), but [docker](https://hub.docker.com/_/redis) is likely a good choice as well.

The quick-start instructions for Redis Cloud are [here](https://redis.io/docs/latest/operate/rc/rc-quickstart/). The relevant connection method in the instructions is Redis client, which will show you the needed env variables.

You have two options for setting up the env variables:

- Use the an url connection string, which has the format of redis://username:password@host:port. You can place this in REDIS_URL.
- You can also place the connection parameters separately, in REDIS_HOST, REDIS_PASSWORD, REDIS_PORT and REDIS_USERNAME

#### Running the backend

The expected and tested node version for the backend is 24.21.0

1. Install dependencies by running the command `npm install`.
2. Start with `npm run start:dev`

The app should start in http://localhost:3001. There will be logs in console if any of the env variables are missing.
