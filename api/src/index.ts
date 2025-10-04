
import { Hono } from 'hono';

const app = new Hono();

app.get('/api/location', (c) => {
  // The `cf` object is automatically provided by Cloudflare
  const locationData = c.req.raw.cf;
  return c.json(locationData);
});

export default app;
