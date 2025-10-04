
import Link from 'next/link';

export default function SummaryPage() {
  const prompt = `
# User Interaction Summary for LLM Instruction Template

## Context:
The user requested to build a client-server web application on Cloudflare using Next.js for the frontend and Hono for the backend. The chosen application idea was a "Geo-Location Data API" that displays the user's location (IP, country, city, etc.) detected by Cloudflare.

## Initial Setup & Challenges Encountered:

1.  **Project Structure:** Created 'app' for Next.js and 'api' for Hono, with a root 'wrangler.toml'.
2.  **Deployment Method:** User opted for GitHub Actions for deployment to Cloudflare Pages.
    *   **Challenge 1: GitHub Actions Configuration:** Initially, the 'wrangler-action' was misconfigured regarding 'projectName', leading to a 'Project not found' error. Corrected by moving 'projectName' into the 'command' string.
    *   **Challenge 2: Project Creation:** Wrangler couldn't create the Cloudflare Pages project. Addressed by creating a dedicated GitHub Action to run 'wrangler pages project create' once.
    *   **Challenge 3: Next.js Static Export:** The deployed Next.js app was blank. Diagnosed as Next.js's default build not being fully static for Pages. Fixed by adding 'output: "export"' to 'next.config.mjs' and updating 'wrangler.toml' and the deploy action to use the 'out' directory.
    *   **Challenge 4: Pages Functions Routing (Key Issue):** Initial attempt to use '[[services]]' in 'wrangler.toml' for Hono worker integration failed, resulting in 404s for API calls.
        *   **Resolution:** Abandoned '[[services]]'. Adopted Cloudflare Pages Functions convention:
            *   Added 'esbuild' to 'api/package.json' for compiling TypeScript to JavaScript.
            *   Modified GitHub Action to build the Hono worker and copy the *compiled output* to a special file: \`./app/out/_worker.js\`. This ensures the Hono worker acts as the main Pages Function intercepting requests.
    *   **Challenge 5: Static Asset Passthrough:** After implementing \`_worker.js\`, the root page became 404. This was because the Worker was intercepting *all* requests (including for \`index.html\`) but didn't know to serve static assets.
        *   **Resolution:** Modified Hono's catch-all route (\`app.get('*', ...)\`) to use \`c.env.ASSETS.fetch(c.req.raw)\`, explicitly telling the Worker to pass non-API requests to the Pages static asset handler.
    *   **Challenge 6: IP Address Missing:** The 'clientIp' field was N/A.
        *   **Resolution:** Modified Hono API to prioritize fetching IP from the \`CF-Connecting-IP\` header, a more reliable source in some Cloudflare proxy scenarios.
    *   **Challenge 7: Frontend Build Error:** Syntax error in `fontFamily` CSS property due to conflicting quotes. Corrected.

## Goal:
Provide an LLM with the necessary context and instruct it to:
1.  Summarize the final working architecture (Next.js frontend, Hono API, Cloudflare Pages/Functions).
2.  Explain the corrected deployment strategy using GitHub Actions.
3.  Highlight the key resolutions for routing, static asset serving, and IP address retrieval.
4.  Present this summary in a clear, concise Markdown format suitable for documentation.
`;

  const llmOutput = `
## Cloudflare Full-Stack Geo-Location App: Architecture & Deployment Summary

### 1. Final Architecture

This application consists of a **Next.js frontend** (React) and a **Hono backend** (TypeScript), both deployed on **Cloudflare Pages**.

*   **Frontend:** The user interface, responsible for displaying location data. Built with Next.js configured for static export.
*   **Backend:** A lightweight API built with Hono, running as a **Cloudflare Pages Function** (a Worker) that intercepts incoming requests. It retrieves geo-location information (including IP address) from Cloudflare's request context.

### 2. Corrected Deployment Strategy (GitHub Actions)

Deployment is managed via a GitHub Actions workflow (`.github/workflows/deploy.yml`) triggered manually by \`workflow_dispatch\`.

1.  **Project Creation:** An initial, separate GitHub Action (\`.github/workflows/create-project.yml\`) runs \`wrangler pages project create\` to provision the Cloudflare Pages project, ensuring the deployment target exists.
2.  **Frontend Build:** \`npm install\` and \`npm run build\` are executed within the \`app/\` directory to create a static build in \`./app/out/\` (enabled by \`output: "export"\` in \`next.config.mjs\`).
3.  **Backend Build:** \`npm install\` and \`npm run build\` are executed within the \`api/\` directory. The Hono API (TypeScript) is compiled into a single JavaScript file (\`./api/dist/index.js\`) using \`esbuild\`.
4.  **Pages Function Integration:** The compiled Hono worker (\`./api/dist/index.js\`) is copied to \`./app/out/_worker.js\`. This critical step places the Worker at the root of the Pages static output, making it the main **Pages Function** that intercepts all requests.
5.  **Deployment:** The \`cloudflare/wrangler-action\` then runs \`wrangler pages deploy ./app/out --project-name=geolocation-app\`, uploading the static frontend assets and the integrated \`_worker.js\` to Cloudflare Pages.

### 3. Key Resolutions for Functionality

*   **API Routing:** The Hono API expects requests at \`/api/location\`. This is handled by the \`_worker.js\` file, which acts as a router.
*   **Static Asset Serving:** The Hono Worker's catch-all route (\`app.get('*', ...)\`) explicitly uses \`c.env.ASSETS.fetch(c.req.raw)\` to pass requests not matching an API route to the Pages static asset handler. This ensures \`index.html\` and other static assets are served correctly.
*   **IP Address Retrieval:** The Hono API explicitly checks \`c.req.header('CF-Connecting-IP')\` first for the client's IP address, falling back to \`c.req.raw.cf.clientIp\`. This addresses scenarios where the standard \`cf.clientIp\` might be missing due to specific proxy or network configurations.

This setup provides a robust, performant, full-stack application leveraging Cloudflare Pages and Functions capabilities.
`;

  return (
    <div style={{ fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif", lineHeight: '1.6', padding: '2rem', maxWidth: '1000px', margin: '0 auto', background: '#f9f9f9', borderRadius: '10px', boxShadow: '0 5px 25px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '2rem', fontSize: '2.5em' }}>
        <span style={{ color: '#3498db' }}>Cloudflare</span> App Development <span style={{ color: '#2ecc71' }}>Summary</span>
      </h1>

      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ display: 'inline-block', padding: '0.8rem 1.5rem', background: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          &larr; Back to GeoLocation Info
        </Link>
      </div>

      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>LLM Prompt</h2>
      <div style={{ background: '#e8f0fe', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', overflowX: 'auto' }}>
        <pre><code dangerouslySetInnerHTML={{ __html: prompt }}></code></pre>
      </div>

      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>LLM Output (Summary)</h2>
      <div style={{ background: '#e8fef2', padding: '1.5rem', borderRadius: '8px', overflowX: 'auto' }}>
        <pre><code dangerouslySetInnerHTML={{ __html: llmOutput }}></code></pre>
      </div>
    </div>
  );
}
