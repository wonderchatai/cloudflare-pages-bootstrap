
import { Hono } from 'hono';

const app = new Hono();

// The specific route for location data
app.get('/api/location', (c) => {
  const cfData = c.req.raw.cf || {}; // Get existing cf object, or an empty one
  const clientIpFromHeader = c.req.header('CF-Connecting-IP'); // Get IP from header

  // Combine or prioritize clientIp
  const responseData = {
    ...cfData,
    clientIp: clientIpFromHeader || cfData.clientIp || 'N/A_from_header',
  };

  return c.json({ data: responseData, source: 'Cloudflare_Worker_Hono' });
});

// Temporarily add an explicit debug route for the root path
app.get('/', (c) => {
  return c.json({
    message: 'Debug: Root path intercepted by Hono Worker',
    path_received_by_worker: c.req.path,
    full_url_received_by_worker: c.req.url,
    userAgent: c.req.header('User-Agent'),
    referer: c.req.header('Referer'),
  });
});

// Original Fallback for static assets - this will now only be hit for non-/ and non-/api/location paths
app.get('*', async (c) => {
  return await (c.env as any).ASSETS.fetch(c.req.raw);
});

export default app;
