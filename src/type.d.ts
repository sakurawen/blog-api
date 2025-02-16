import { NotionAPI } from "notion-client"

export type Env ={
  Bindings: {
    NOTION_KEY: string
    NOTION_PAGE_ID: string
  },
  Variables: {
    notion: NotionAPI
  }
}
