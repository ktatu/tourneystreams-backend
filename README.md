[![Build](https://github.com/ktatu/tourneystreams-backend/actions/workflows/ci_cd.yml/badge.svg)](https://github.com/ktatu/tourneystreams-backend/actions/workflows/ci_cd.yml)
[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/tkaq.svg)](https://uptime.betterstack.com/?utm_source=status_badge)

# tourneystreams-backend

For general information about the project, check out the [frontend repository](https://github.com/ktatu/tourneystreams-frontend)

### Local development

These instructions are for backend only.

Don't use safari. The app uses secure cookies, which clashes with running on localhost, according to [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies#block_access_to_your_cookies)

#### Twitch api

Follow the instructions on https://dev.twitch.tv/docs/authentication/register-app

1. When registering the application, use http://localhost:3001/twitch/redirect as the redirect URL. The form may initially say "https only", but it will accept localhost

2. In your application management page, there will be client ID, redirect url (same as above), and client secret. Save these in the keys TWITCH_CLIENT_ID, TWITCH_CALLBACK_URL and TWITCH_CLIENT_SECRET of the .env file

3. Make sure you have some channels followed for testing the app. The button is on the bottom-right of streams

#### YouTube api

Adding a YouTube api key can be safely skipped. The api is only used to match the livestreams added from the app bar with YouTube channel names. Not using the api results in video IDs being used as channel names.

1. Follow steps 1-3 here: https://developers.google.com/youtube/v3/getting-started
    1. The page for creating an api key might be difficult to find. You can insert your project's name here: https://console.cloud.google.com/apis/credentials?project=yourprojecthere-12345
    2. Click "Create credentials" on top
    3. Select "API key" in the dropdown selection
    4. Select "YouTube Data API v3" in the API restrictions select, and click create
    5. Place the key in YOUTUBE_API_KEY in .env

#### Redis

Note:
The app requires the redis instance to have the (RedisJSON)[https://github.com/RedisJSON/RedisJSON/tree/master] module installed. Any redis version above 8.0 should have it on by default.
