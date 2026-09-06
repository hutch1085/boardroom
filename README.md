# The Boardroom

Crypto scanner agents that debate your portfolio using Claude AI.

## Setup

```bash
npm install
```

Create a `.env` file (or set the environment variable):

```bash
cp .env.example .env
# Edit .env and add your Anthropic API key
```

## Run locally

```bash
ANTHROPIC_API_KEY=sk-ant-... npm start
```

Open http://localhost:3000

## Deploy

### Vercel

```bash
vercel --prod
# Set ANTHROPIC_API_KEY in Vercel project settings > Environment Variables
```

## Architecture

- `server.js` — Express server that serves the frontend and proxies `/api/chat` to the Anthropic Messages API. The API key never reaches the client.
- `public/index.html` — The Boardroom UI with four AI agents (Dawn, Noon, Close, Night) debating crypto strategy. Live prices from CoinPaprika.
