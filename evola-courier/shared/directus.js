import { createDirectus, staticToken, rest } from '@directus/sdk';
import config from './config.js';

export const directus = createDirectus(config.directus_api_url)
  .with(staticToken(config.directus_token))
  .with(rest());;