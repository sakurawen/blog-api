import { NotionAPI } from "notion-client";
import {createFactory} from "hono/factory";
import {Env} from "~/src/type";
const factory = createFactory<Env>();

export const notionMiddleware = factory.createMiddleware((c,next)=>{
  c.set("notion",new NotionAPI({
    authToken:c.env.NOTION_KEY
  }))
  return next()
})
