import { drizzle } from 'drizzle-orm/libsql';
import { getClient } from '@/lib/storage';
import * as schema from './schema';
export function getDb(){return drizzle(getClient(),{schema});}
