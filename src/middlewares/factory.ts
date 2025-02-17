import type { Env } from '~/type';
import { createFactory } from 'hono/factory';

export const factory = createFactory<Env>();
