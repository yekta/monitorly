# Statusly - Uptime & Status Monitoring

Statusly is a simple uptime & status monitoring app with a twist:

Instead of watching the result of an HTTP call, each monitor watches the result of a promise. The function it watches must return a promise that resolves to a boolean. If the value is `true`, the monitored system is considered to be operational.

```ts
type TMonitor = {
  functionToRun: () => Promise<boolean>;
  // ...
};
```

Because of this, you can monitor any async process you want, not just simple HTTP calls.

## Get started

### Development

1. Clone the repo
2. Run `pnpm install`
3. Create a PostgreSQL database (via [Supabase](https://supabase.com/), [Neon](https://neon.tech/), [Railway](https://railway.app/), etc.)
4. Rename the `env.example` files in the `apps/server` and `apps/web` directories to `.env` and fill in the connection connection string.
5. Run `pnpm dev` to start the dev server
