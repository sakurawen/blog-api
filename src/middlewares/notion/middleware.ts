import { NotionAPI } from 'notion-client';
import { factory } from '../factory';

let notionClient: NotionAPI;
export const notionMiddleware = factory.createMiddleware((c, next) => {
  if (!notionClient) {
    notionClient = new NotionAPI({
      authToken: c.env.NOTION_KEY,
    });
    c.set('notion', notionClient);
  }
  else {
    c.set('notion', notionClient);
  }

  return next();
});
