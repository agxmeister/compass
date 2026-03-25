# Compass

MCP (Model Context Protocol) server that provides browser automation capabilities.

## Build

```bash
npm run build   # tsc && tsc-alias
```

## Architecture

- **TypeScript** (strict mode, ES2022 target, ES modules) with **Inversify** for DI
- Entry point: `src/index.ts` — boots the container, discovers tools, starts an MCP server over stdio
- DI container: `src/container.ts` — all bindings; symbols in `src/dependencies.ts`
- Path alias: `@/*` maps to `src/*` (resolved at build time by `tsc-alias`)

### Modules (`src/modules/`)

| Module | Purpose |
|--------|---------|
| `mcp/` | MCP server setup, tool registration, tool execution orchestration |
| `mcp/tools/` | Individual tool implementations (CreateSession, Navigate, Click, DeleteSession) |
| `browser/` | Generic `BrowserService` interface for browser automation |
| `browser/axis/` | Axis implementation of `BrowserService` |
| `driver/` | Generic `Driver` interface; `RestDriver` executes commands + records protocol |
| `http/` | Low-level HTTP client with URL template resolution |
| `journey/` | Protocol recording — audit trail of all browser interactions (protocol.json) |
| `binary/` | Binary file storage for screenshots |
| `config/` | Env-based config with Zod validation |
| `log/` | Pino logger with dev (pretty) / prod (JSON) modes |

### Key patterns

- **Factory pattern** for creating services (AxisServiceFactory, RestDriverFactory, etc.)
- **Builder pattern** for ProtocolRecordBuilder and ToolOutputBuilder
- **Generic interfaces** — BrowserService and Driver are generic to allow alternative implementations
- **Decorator-based tool registration** — `@RegisterTool()` auto-registers tools in the DI container
- **Tool discovery** — `ToolDiscoveryService` dynamically imports files matching `*Tool.{ts,js}` from the tools directory

### Data flow

```
MCP Client → McpService → Tool.execute() → BrowserToolService
  → BrowserService → Driver → browser automation service
  → ProtocolRecordBuilder → ProtocolService → protocol.json
  → BinaryService → screenshot files
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

## Conventions

- Each module has an `index.ts` barrel file re-exporting its public API
- Zod schemas define both validation and TypeScript types (via `z.infer`)
- All DI symbols are centralized in `src/dependencies.ts`
- New tools: create a file matching `*Tool.ts` in `src/modules/mcp/tools/` and use `@RegisterTool()`
