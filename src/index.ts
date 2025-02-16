import { Hono } from 'hono'
import { Env } from "~/src/type";
import { notionMiddleware } from "./middleware";

const app = new Hono<Env>()

app.use(notionMiddleware)

app.get('/blog', async (c) => {
  const result = await c.var.notion.getPage(c.env.NOTION_PAGE_ID)
  return c.json(result)
})

app.get("/blog/:id",async (c)=>{
  const id = c.req.param("id")
  const result = await c.var.notion.getPage(id)
  return c.json(result)
})

export default app
