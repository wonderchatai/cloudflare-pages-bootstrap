
import { Hono } from 'hono';

const app = new Hono();

// The specific route we want to hit, now returning only the relevant data.
app.get('/api/location', (c) => {
  const locationData = c.req.raw.cf; // Cloudflare automatically populates the 'cf' object
  return c.json({ data: locationData, source: 'Cloudflare_Worker_Hono' });
});

export default app;
