# Compass

MCP server that provides browser automation capabilities. Tool calls are logged and browser interactions, alongside with captured screenshots, are recorded to the protocol in the journey directory (`JOURNEY_DIR`, `JOURNEY_NAME`).

## Integrations

- **Axis** — external service that performs browser automation, accessed via REST API (`AXIS_API_URL`)

## Build

```bash
npm run build
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AXIS_API_URL` | Yes | — | Axis API endpoint |
| `HTTP_TIMEOUT` | No | `30000` | HTTP request timeout (ms) |
| `LOG_LEVEL` | No | `info` | Logging level |
| `LOG_ENVIRONMENT` | No | `development` | `development` for pretty logs, else JSON |
| `JOURNEY_DIR` | No | `data/journeys` | Directory for protocol recordings |
| `JOURNEY_NAME` | No | `default` | Journey identifier |

## Adding tools

Create a file matching `*Tool.ts` in `src/modules/mcp/tools/` and use the `@RegisterTool()` decorator.

## Dependency injection

- DI container (Inversify): `src/container.ts`
- DI symbols: `src/dependencies.ts`
