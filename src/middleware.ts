import type { Env } from '~/src/type';
import { createFactory } from 'hono/factory';
import { NotionAPI } from 'notion-client';

const factory = createFactory<Env>();

export const notionMiddleware = factory.createMiddleware((c, next) => {
  c.set('notion', new NotionAPI({
    authToken: c.env.NOTION_KEY,
  }));
  return next();
});
