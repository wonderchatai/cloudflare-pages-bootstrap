
import { Hono } from 'hono';

const app = new Hono();

// The specific route for location data
app.get('/api/location', (c) => {
  const cfData = c.req.raw.cf || {}; // Get existing cf object, or an empty one
  const clientIpFromHeader = c.req.header('CF-Connecting-IP'); // Get IP from header

  // Combine or prioritize clientIp
  const responseData = {
    ...cfData,
    clientIp: clientIpFromHeader || cfData.clientIp || 'N/A_from_header', // Prioritize header IP
  };

  return c.json({ data: responseData, source: 'Cloudflare_Worker_Hono' });
});

// Fallback for static assets.
// This route will only be hit if no other Hono route matches.
// We need to pass the request to the Pages static asset handler.
app.get('*', async (c) => {
  return await (c.env as any).ASSETS.fetch(c.req.raw);
});

export default app;
