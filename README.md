# Statusly

Statusly is a simple uptime & status monitoring app.

Instead of watching the result of an HTTP call, each monitor watches the result of a function. The function must return a promise that resolves to a boolean. If the value is `true`, the monitored system is considered to be operational.

```ts
type TMonitor = {
	functionToRun: () => Promise<boolean>;
	// ...
};
```

Because of this, you can monitor any async process you want, not just simple HTTP calls.
