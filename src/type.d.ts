import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { NotionAPI } from 'notion-client';
import type * as schema from '~/schema';

export interface Env {
  Bindings: {
    NOTION_KEY: string
    NOTION_PAGE_ID: string
    DATABASE_URL: string
  }
  Variables: {
    notion: NotionAPI
    db: NeonHttpDatabase<typeof schema>
  }
}
