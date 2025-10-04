
import { Hono } from 'hono';

const app = new Hono();

// The specific route we want to hit.
app.get('/api/location', (c) => {
  const locationData = c.req.raw.cf;
  return c.json({ data: locationData, source: 'specific_route' });
});

// Add a catch-all route for debugging.
// This will return the exact path the worker received.
app.get('*', (c) => {
  return c.json({
    message: 'Debug Info: Catch-all route triggered',
    path_received_by_worker: c.req.path,
    full_url_received_by_worker: c.req.url,
  });
});

export default app;
