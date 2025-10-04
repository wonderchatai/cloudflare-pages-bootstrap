# Cloudflare Pages Full-Stack Geo-Location App

This project demonstrates a full-stack web application deployed on Cloudflare Pages, leveraging Next.js for the frontend and Hono running as a Cloudflare Pages Function (Worker) for the backend API.

## Technical Summary

### Frontend (Next.js - Static Export)

*   **Framework:** Next.js (React)
*   **Build Output:** Configured to produce a static HTML/CSS/JS export (`output: 'export'` in `next.config.mjs`).
*   **Deployment:** The static assets are served globally by Cloudflare Pages.
*   **Functionality:** Displays geo-location data fetched from the backend API.

### Backend (Hono - Cloudflare Pages Function)

*   **Framework:** Hono (TypeScript)
*   **Deployment:** Runs as a **Cloudflare Pages Function** (`_worker.js`). This means the compiled Worker code (`api/dist/index.js`) is copied into the `app/out/_worker.js` file at the root of the Next.js static build output.
*   **Functionality:**
    *   Intercepts requests to `/api/location`.
    *   Extracts client geo-location data and IP address (prioritizing `CF-Connecting-IP` header) from Cloudflare's request context (`c.req.raw.cf`).
    *   Returns this data as JSON.
*   **Static Asset Handling:** Includes a catch-all route that explicitly passes requests not matching API routes back to the Pages static asset handler (`c.env.ASSETS.fetch(c.req.raw)`), ensuring the Next.js frontend is served correctly.

### Deployment Workflow (GitHub Actions)

This project uses GitHub Actions for automated CI/CD to Cloudflare Pages. Key aspects:

*   **Triggers:** Manual `workflow_dispatch` trigger for controlled deployments.
*   **Build Steps:** Separately installs dependencies and builds both the Next.js frontend and the Hono backend (using `esbuild` for TypeScript compilation).
*   **Integration:** The compiled Hono Worker is integrated into the Next.js build output by copying it to `app/out/_worker.js`.
*   **Deployment:** The `cloudflare/wrangler-action` is used to deploy the final `app/out` directory to Cloudflare Pages.
*   **Project Creation:** A separate GitHub Action (`create-project.yml`) exists to programmatically create the Cloudflare Pages project using `wrangler pages project create`.

### Project Links

*   **GitHub Repository:** [https://github.com/wonderchatai/ta](https://github.com/wonderchatai/ta)
*   **GitHub Actions Runs:** [https://github.com/wonderchatai/ta/actions](https://github.com/wonderchatai/ta/actions)
*   **Live Application:** [https://geolocation-app.pages.dev](https://geolocation-app.pages.dev)

Built with [WonderChat](https://wonderchat.dev)
