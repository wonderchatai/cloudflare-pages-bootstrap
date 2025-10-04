
import { Hono } from 'hono';

const app = new Hono();

// The specific route for location data
app.get('/api/location', (c) => {
  const locationData = c.req.raw.cf; // Cloudflare automatically populates the 'cf' object
  return c.json({ data: locationData, source: 'Cloudflare_Worker_Hono' });
});

// Fallback for static assets.
// This route will only be hit if no other Hono route matches.
// We need to pass the request to the Pages static asset handler.
app.get('*', async (c) => {
  // c.env.ASSETS is a special binding provided by Cloudflare Pages for accessing static assets
  // We need to ensure the context type is correct to access c.env.ASSETS
  return await (c.env as any).ASSETS.fetch(c.req.raw);
});

export default app;
