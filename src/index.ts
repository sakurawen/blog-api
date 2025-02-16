import { Hono } from 'hono'
import { Env } from "~/src/type";
import { notionMiddleware } from "./middleware";

const app = new Hono<Env>()

app.use(notionMiddleware)

app.get('/', async (c) => {
  const data = await c.var.notion.getPage(c.env.NOTION_PAGE_ID)
  return c.json(data)
})

export default app
