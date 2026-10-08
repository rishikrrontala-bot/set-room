import { env } from 'cloudflare:workers';
export function database() { if(!env.DB)throw new Error('Saved scores are unavailable. Try again shortly.');return env.DB; }
