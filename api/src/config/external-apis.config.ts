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
