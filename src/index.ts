import type { Env } from '~/type';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import * as schema from '~/schema';
import { betterAuthMiddleware } from './middlewares/better-auth';
import { drizzleMiddleware } from './middlewares/db';
import { notionMiddleware } from './middlewares/notion';
import { sessionMiddleware } from './middlewares/session';

const app = new Hono<Env>();

app
  .use('*', cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://www.akumanoko.com', 'https://akumanoko.com', 'https://blog.akumanoko.com'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }))
  .use(drizzleMiddleware)
  .use(notionMiddleware)
  .use(betterAuthMiddleware);

app.get('/', (c) => {
  return c.text('New World');
});

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  const auth = c.var.auth;
  return auth.handler(c.req.raw);
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
    const result = await c.var.db.query.comments.findMany({
      with: {
        user: true,
      },
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

app.post('/comments', sessionMiddleware, zValidator('json', z.object({
  postId: z.string(),
  userId: z.string(),
  content: z.string(),
})), async (c) => {

  if (!c.var.user) {
    return c.body(null, 403);
  }

  const create = c.req.valid('json');
  const result = await c.var.db.insert(schema.comments).values({
    ...create,
    createAt: new Date(),
  });
  return c.json(result);
});

export default app;
