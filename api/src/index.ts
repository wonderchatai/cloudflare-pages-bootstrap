
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

// Fallback for static assets with debug reporting
app.get('*', async (c) => {
  try {
    const assetResponse = await (c.env as any).ASSETS.fetch(c.req.raw);

    // Explicitly handle 304 as a successful pass-through
    if (assetResponse.status === 304) {
      return assetResponse; // Return the 304 response directly
    }

    if (assetResponse.ok) {
      return assetResponse;
    } else {
      // For other non-OK statuses (4xx, 5xx), report it
      const errorText = await assetResponse.text();
      return c.json({
        message: `Debug: ASSETS.fetch returned non-OK status (${assetResponse.status}) for ${c.req.path}`,
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        assetPath: c.req.path,
        responseText: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : ''),
      }, 500); // Return a 500 for internal asset fetching issues
    }
  } catch (error: any) {
    // If ASSETS.fetch throws an error
    return c.json({
      message: `Debug: ASSETS.fetch threw an error for ${c.req.path}`,
      errorName: error.name,
      errorMessage: error.message,
      assetPath: c.req.path,
    }, 500);
  }
});

export default app;
