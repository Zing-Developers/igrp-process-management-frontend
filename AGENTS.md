<!-- CODEGRAPH_START -->
## CodeGraph

This repository has an initialized CodeGraph index in `.codegraph/`. Use CodeGraph first when locating or understanding code, before `rg`, `find`, or opening source files. If the directory is absent in another checkout, skip CodeGraph; indexing is the user's decision.

1. Ask a focused question with `codegraph_explore` through the MCP server when the tool is available. Include a symbol or file path when known, for example: `codegraph_explore("How does useProcessInstances fetch and filter data?")`. The result includes current, line-numbered source and related call paths. If a relevant symbol is deferred, explore that exact name or use `codegraph_node`.
2. If the MCP tools are unavailable, use the equivalent CLI from the repository root: `codegraph explore "How does useProcessInstances fetch and filter data?"`. Use `codegraph node "useProcessInstances"` for one symbol or `codegraph node "src/app/.../page.tsx"` for a file.
3. Before changing a shared symbol, inspect its callers and impact with `codegraph callers "<symbol>"` and `codegraph impact "<symbol>"` (or the corresponding MCP tools, if exposed). Use `codegraph affected <changed-file>` to find related tests.
4. Check `codegraph status` if results seem stale. Run `codegraph sync` after code changes or when the index is out of date, then repeat the relevant query. Use `codegraph index` only when a full rebuild is needed.

Use `rg` and direct file reads for exact text searches, non-indexed files, or details CodeGraph does not return. Keep queries narrow to avoid large, truncated results.
<!-- CODEGRAPH_END -->
