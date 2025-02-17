import type { Env } from '~/type';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { drizzleMiddleware } from './middlewares/db/middleware';
import { notionMiddleware } from './middlewares/notion/middleware';
import * as schema from "~/schema"

const app = new Hono<Env>();

app.use(notionMiddleware).use(drizzleMiddleware);

app.get('/', (c) => {
  return c.text('New World');
});

app.get('/blog', async (c) => {
  const result = await c.var.notion.getPage(c.env.NOTION_PAGE_ID, { fetchMissingBlocks: false });
  return c.json(result);
});

app.get('/blog/:id', async (c) => {
  const id = c.req.param('id');
  const result = await c.var.notion.getPage(id);
  return c.json(result);
});

app.get('/comments/:postId', async (c) => {
  try {
    const postId = c.req.param('postId');
    const result = c.var.db.query.comments.findMany({
      where(fields, { eq }) {
        return eq(fields.postId, postId);
      },
    });
    return c.json(result);
  }
  catch (e) {
    console.error('get comment failed:', e);
    return c.json([]);
  }
});

app.post('/comments', zValidator('json', z.object({
  postId: z.string(),
  userId: z.string(),
  content: z.string(),
  createAt: z.date(),
})), async (c) => {
  const create = c.req.valid('json');
  const result = await c.var.db.insert(schema.comments).values(create)
  return c.json(result)
});

export default app;
