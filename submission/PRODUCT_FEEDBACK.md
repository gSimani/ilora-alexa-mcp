# Product feedback

One section per tool, API or SDK used, in the five questions the rules ask. Every result here was observed during the build; nothing is claimed that we did not run.

## Model Context Protocol TypeScript SDK (`@modelcontextprotocol/sdk` 1.32.1)
- **Used for:** The MCP server (`McpServer.registerTool` with `inputSchema`/`outputSchema`, `registerResource`), the Streamable HTTP transport (Node and web-standard), and the simulator's browser MCP client (`Client`, `StreamableHTTPClientTransport`).
- **Worked well:** `LATEST_PROTOCOL_VERSION` is `2025-11-25` out of the box. Stateless Streamable HTTP with `enableJsonResponse` took a few lines. Zod schemas become JSON Schema in `tools/list` automatically, and the client validates results against `outputSchema`, which caught a real bug in our tests. Warm tool calls answer in 6 to 25 ms.
- **Needs work:** The client validates `structuredContent` even when `isError` is true (friction log #3). The Node transport did not survive an Express-on-Lambda adapter (#4). No Lambda example in the README.
- **Onboarding:** About 30 minutes from `npm install` to a server listed by Inspector.
- **Build again:** Yes. The schema-first design is what makes Alexa-style tool selection reliable.

## MCP Apps extension (`@modelcontextprotocol/ext-apps` 2.0.3)
- **Used for:** The `ui://` Card and List views, MIME type `text/html;profile=mcp-app`, `_meta.ui.resourceUri` on tools, and the postMessage protocol (`ui/initialize`, `ui/notifications/tool-result`, `ui/message`, `ui/notifications/size-changed`) implemented on both the view and host sides.
- **Worked well:** The spec types made the handshake easy to implement by hand; a view and a minimal host fit in about 150 lines.
- **Needs work:** Server helpers type against `@modelcontextprotocol/server`, not the stable SDK (#5).
- **Onboarding:** About an hour, mostly reading the spec types.
- **Build again:** Yes. A Card that shows both numbers and the source line is the point of the demo.

## Alexa+ add-on documentation (MCP Toolkit, design guide, functional requirements)
- **Used for:** Tool design rules (one intent per tool, declare only what you honor, always return something, no tracking parameters), voice-first answers, Card and List patterns, Visual Foundations tokens, light and dark mode.
- **Worked well:** The tool and schema design page is short and concrete, and following it shaped all five tools. Visual Foundations gives exact token values.
- **Needs work:** The toolkit's gated status is easy to miss (#1). Card and List have no code-level template (#2). Functional requirements give a 3-second search target; the Carousel page gives 500 ms for the first item. One stated latency target for MCP tool calls would help.
- **Onboarding:** About 1.5 hours across nine pages.
- **Build again:** Yes, and we would join the toolkit preview to ship this for real.

## AWS Lambda (function URL, Node.js 22, arm64) and AWS SAM
- **Used for:** Hosting the MCP server, the simulator and the brain in one function; `template.yaml` deploys and `sam delete` removes it.
- **Worked well:** A function URL is the shortest path to a public HTTPS MCP endpoint. Local invocation of the bundle with a function-URL event gave 14 ms for `initialize` and 22 ms for a tool call.
- **Measured on the deployed function (us-east-1, 512 MB, arm64, Oct 19, 2026):** cold start 1.5 s to the first response; warm `tools/call` 135 to 160 ms from Florida including the network; all five demo questions ran end to end through the deployed simulator. MCP Inspector listed all five tools from the function URL.
- **Needs work:** The Express adapter issue (#4) is the kind of thing a Lambda MCP blueprint would prevent. A 1.5 s cold start is fine for a demo but is three times the 500 ms first-result target; provisioned concurrency would fix it at a cost.
- **Onboarding:** About 20 minutes from template to a working URL, most of it spent on the 415 issue. `sam deploy --resolve-s3` with one command was smooth.
- **Build again:** Yes. Zero cost when idle fits a judged demo.

## Amazon Bedrock (Converse API with tool use)
- **Used for:** The brain, implemented in `src/assistant/bedrock.ts`: it passes the MCP tool list as Converse `toolSpec`s and returns which tool to call, as Alexa+ does. Enabled with `BRAIN=bedrock`.
- **What happened:** Every Converse call from our account returned `ValidationException: Error 002: Access to Bedrock models is not allowed for this account`, for Nova Lite, Nova Micro and Claude Haiku 4.5, in us-east-1 and us-west-2, while `GetFoundationModelAvailability` reported the model AUTHORIZED and AVAILABLE and `ListFoundationModels` worked. Public AWS re:Post threads describe this as an account-level restriction that only AWS Support can clear. So the demo ran with the offline planner, and we say so on screen. See friction log #8.
- **Worked well:** The Converse API's tool-use shape maps one-to-one onto MCP `tools/list`, so the brain is 60 lines.
- **Needs work:** The error gives no reason and no action. The availability API says AUTHORIZED while every call is refused.
- **Onboarding:** Blocked at the first call.
- **Build again:** Yes, once the account is cleared. The integration is written and switched on by one environment variable.

## Amazon Polly (neural voice)
- **Used for:** Speaking each answer (`/api/speak`, neural voice "Ruth", MP3); the page falls back to the browser voice when Polly is off.
- **Worked well:** First call worked with no setup. On the deployed function a one-sentence answer came back in 0.53 s (53 KB MP3); all five demo answers were spoken. Numbers and dollar amounts are read naturally.
- **Needs work:** Nothing blocking. An option to stream the first audio chunk sooner would make long answers start faster.
- **Onboarding:** Minutes: one `SynthesizeSpeech` call.
- **Build again:** Yes.

## MCP Inspector (2.11.0)
- **Used for:** Independent check of `tools/list` and `tools/call` over Streamable HTTP.
- **Worked well:** The `--cli` mode is scriptable and needs no UI.
- **Needs work:** Requires Node 22.19+ (#6).
- **Build again:** Yes.

## Feature requests

| Request | Why it matters to this project | Priority |
|---|---|---|
| Open the MCP Toolkit Web Simulator to hackathon participants, even read-only | We could show the server inside real Alexa+ instead of a simulation | Critical |
| Publish the Card and List templates as code with token CSS variables | Our views would match Alexa+ exactly instead of following prose | Important |
| One documented latency target for MCP tool calls | We designed to 500 ms from the Carousel page; a stated target removes guesswork | Important |
| A Lambda function-URL example for the MCP SDK's web-standard transport | Would have saved the 415 detour (#4) | Nice-to-have |
| Client-side output validation that skips `isError` results | Structured errors would reach the model intact | Important |
