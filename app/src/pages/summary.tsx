
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';

export default function SummaryPage({ conversation }) {
  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      lineHeight: '1.6',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to right, #ece9e6, #ffffff)',
      padding: '1rem', // Adjusted outer padding for more mobile space
      boxSizing: 'border-box'
    }}>
      <Head>
        <title>Prompting Cloudflare App using WonderChat</title>
      </Head>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        padding: '1rem', // Adjusted inner padding for more mobile space
        borderRadius: '15px',
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        boxSizing: 'border-box',
      }}>
        <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '2rem', fontSize: '2.5em' }}>
          <span style={{ color: '#3498db' }}>Cloudflare</span> App Development <span style={{ color: '#2ecc71' }}>Log</span>
        </h1>

        <div style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-block', padding: '0.8rem 1.5rem', background: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            &larr; Back to GeoLocation Info
          </Link>
        </div>

        {/* Add the screenshot here */}
        <img
          src="/wonderchat_initial_prompt.png"
          alt="WonderChat Initial Prompt"
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            margin: '0 auto 2rem auto',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          }}
        />

        <div style={{
          background: '#e8f0fe',
          padding: '1rem', // Adjusted padding for markdown block
          borderRadius: '8px',
          overflowX: 'auto',
          fontSize: '0.9em',
          lineHeight: '1.4',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}>
          <ReactMarkdown
            components={{
              pre: ({ node, ...props }) => <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '100%', overflowX: 'auto' }} {...props} />,
              code: ({ node, ...props }) => <code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '100%', overflowX: 'auto' }} {...props} />,
            }}
          >{conversation}</ReactMarkdown>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>Explore the project:</p>
          <Link href="https://github.com/wonderchatai/cloudflare-pages-bootstrap" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold', margin: '0 10px' }}>
            View Code on GitHub
          </Link>
          <Link href="https://github.com/wonderchatai/cloudflare-pages-bootstrap/actions" target="_blank" rel="noopener noreferrer" style={{ color: '#2ecc71', textDecoration: 'none', fontWeight: 'bold', margin: '0 10px' }}>
            View GitHub Actions Runs
          </Link>
        </div>
      </div>
      <footer style={{ marginTop: '2rem', textAlign: 'center', color: '#666', width: '100%' }}>
        Built with <a href="https://wonderchat.dev" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none' }}>WonderChat</a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const markdownFilePath = path.join(process.cwd(), '..', 'temp_conversation.md');
  let conversation = '';
  try {
    conversation = fs.readFileSync(markdownFilePath, 'utf8');
  } catch (error) {
    console.error("Error reading Markdown file:", error);
    conversation = "Error loading conversation log. Please check the file path.";
  }

  return {
    props: {
      conversation,
    },
  };
}
