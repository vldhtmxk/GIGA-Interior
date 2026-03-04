# Context7 Usage Policy

## Goal
Always use up-to-date, version-specific documentation before applying framework/library-level changes.

## Connection
- MCP connection id: `context7-mcp-mlA3`
- Server: `upstash/context7-mcp`

## Required Workflow (for each non-trivial change)
1. Resolve target library in Context7.
2. Query docs for the exact feature/API to use.
3. Apply implementation using confirmed API only.
4. Note the checked library/version in PR/work log.

## Scope
- React, Next.js, Tailwind, TypeScript, Radix UI, build tools, testing tools, and any new dependency.

## Rules
- Do not introduce deprecated APIs when a current stable API exists.
- Prefer stable releases unless project explicitly requests experimental/canary.
- If Context7 cannot resolve clearly, fall back to official docs and note uncertainty.

