
import { Hono } from 'hono';

const app = new Hono();

// The path should be what's left AFTER the service binding route is stripped.
// The browser requests /api/location, Pages routes it, and the worker receives /location.
app.get('/location', (c) => {
  // The `cf` object is automatically provided by Cloudflare
  const locationData = c.req.raw.cf;
  return c.json(locationData);
});

export default app;
