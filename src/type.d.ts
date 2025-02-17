import type { betterAuth } from 'better-auth';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { NotionAPI } from 'notion-client';
import type * as schema from '~/schema';

export interface Env {
  Bindings: {
    NOTION_KEY: string
    NOTION_PAGE_ID: string
    DATABASE_URL: string
    BETTER_AUTH_URL: string
    BETTER_AUTH_SECRET: string
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string
  }
  Variables: {
    auth: ReturnType<typeof betterAuth>
    notion: NotionAPI
    db: NeonHttpDatabase<typeof schema>
  }
}
