import { registerAs } from '@nestjs/config';

export const externalApisConfig = registerAs('externalApis', () => ({
  gnews: {
    apiKey: process.env.GNEWS_API_KEY,
    baseUrl: process.env.GNEWS_BASE_URL || 'https://gnews.io/api/v4',
    language: process.env.GNEWS_LANGUAGE || 'pt',
    country: process.env.GNEWS_COUNTRY || 'br',
    category: process.env.GNEWS_CATEGORY || 'general',
    max: parseInt(process.env.GNEWS_MAX, 10) || 10,
  },
  newsApi: {
    apiKey: process.env.NEWS_API_KEY,
    baseUrl: process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2',
    language: process.env.NEWS_API_LANGUAGE || 'pt',
    country: process.env.NEWS_API_COUNTRY || 'br',
    max: parseInt(process.env.NEWS_API_MAX, 10) || 20,
  },
  reddit: {
    apiKey: process.env.REDDIT_API_KEY,
    baseUrl: process.env.REDDIT_BASE_URL || 'https://www.reddit.com',
    userAgent: process.env.REDDIT_USER_AGENT || 'PoliqNewsBot/1.0',
  },
  twitter: {
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    baseUrl: process.env.TWITTER_BASE_URL || 'https://api.twitter.com/2',
  },
  meta: {
    accessToken: process.env.META_ACCESS_TOKEN,
    appId: process.env.META_APP_ID,
    appSecret: process.env.META_APP_SECRET,
    apiVersion: process.env.META_API_VERSION || 'v18.0',
  },
  scheduler: {
    newsFetchInterval: process.env.NEWS_FETCH_INTERVAL || '0 */30 * * * *',
    contentGenerationInterval: process.env.CONTENT_GENERATION_INTERVAL || '0 0 */2 * * *',
  },
}));
