# Friction log

Real snags hit while building, in the order they happened. Severity: High (blocked progress), Medium (cost real time or needed a workaround), Low (annoyance).

### 1. Alexa+ docs point to tools participants cannot get
- **Task:** Find how to register a self-hosted MCP server with Alexa+.
- **Steps:** Read the MCP Toolkit overview, quickstart links and design guide.
- **Expected:** A path to connect a server, or a note that the toolkit is gated.
- **Actual:** The overview describes `alexa-ai deploy` and the add-on Agent Skill. That the toolkit is select-partners-only is stated on the add-ons home page and the hackathon FAQ, not on the setup pages.
- **Severity:** Medium. **Workaround:** Simulated client, as the FAQ allows.
- **Suggestion:** Put a one-line "preview, select partners only" banner on every toolkit setup page, with a link to the simulated-experience path.

### 2. Card and List templates have no code-level spec
- **Task:** Build the MCP Apps visuals "using the provided templates (Card, List)".
- **Steps:** Read Components and Patterns, Visual Foundations, Display Modes.
- **Expected:** A template package, HTML skeleton or JSON schema for Card and List, with field limits.
- **Actual:** The pages describe the patterns in prose and list token values (`textStyleBody1`, `spacingMedium`, `shapeRoundedRectLarge`, card colors) but give no package name, CSS variable prefix, markup or item limits for Card and List.
- **Severity:** Medium. **Workaround:** Hand-built Card and List views that follow the prose and use the token values as CSS custom properties.
- **Suggestion:** Publish the templates as an npm package or copyable HTML, with the token CSS variables and limits (max fields, items, actions).

### 3. MCP SDK client validates `structuredContent` on error results
- **Task:** Return structured errors (unknown property, with close matches) from tools that declare an `outputSchema`.
- **Steps:** Returned `isError: true` with `structuredContent: { error: {...} }`.
- **Expected:** Clients read the error. The server-side SDK skips output validation when `isError` is set.
- **Actual:** `@modelcontextprotocol/sdk` 1.32.1 `Client.callTool` validated the error object against the success schema and threw `-32602 Structured content does not match the tool's output schema`, so the caller never saw the error.
- **Severity:** Medium. **Workaround:** Errors carry their JSON in text content only.
- **Suggestion:** Skip client-side output validation when `isError` is true (matching the server), or allow an error schema. Alexa+ docs could state how Alexa+ treats `structuredContent` on errors.

### 4. Streamable HTTP transport behind an Express-on-Lambda adapter returns 415
- **Task:** Run the same Express app on AWS Lambda with a function URL.
- **Steps:** Wrapped the app with `serverless-http`; invoked with a function-URL event carrying `content-type: application/json`.
- **Expected:** Same behavior as local.
- **Actual:** Every `/mcp` POST returned `415 Unsupported Media Type: Content-Type must be application/json`. The Node transport converts the request internally and the header did not survive the adapter.
- **Severity:** Medium. **Workaround:** On Lambda, `/mcp` uses `WebStandardStreamableHTTPServerTransport` directly: event to Fetch `Request`, `Response` back to the event result.
- **Suggestion:** Document a Lambda function-URL example for the web-standard transport in the SDK README; Lambda is the FAQ's recommended host.

### 5. MCP Apps server helpers target a different SDK package
- **Task:** Register the Card and List with `@modelcontextprotocol/ext-apps` server helpers.
- **Actual:** `ext-apps` 2.0.3 `registerAppTool` types import from `@modelcontextprotocol/server`, while the stable TypeScript SDK is `@modelcontextprotocol/sdk` 1.32.1.
- **Severity:** Low. **Workaround:** Used the exported constants (`RESOURCE_MIME_TYPE`, `RESOURCE_URI_META_KEY`) and set `_meta.ui.resourceUri` by hand.
- **Suggestion:** State which SDK major each ext-apps release supports.

### 6. MCP Inspector needs a newer Node than the SDK
- **Task:** Verify the server with MCP Inspector.
- **Actual:** Inspector 2.11.0 warns `EBADENGINE` and requires Node 22.19.0; Node 22.17.0 is installed. It still worked.
- **Severity:** Low. **Suggestion:** Put the Node floor in the Inspector quick-start line.

### 7. Optional GET stream shows up as an error in client logs
- **Task:** Run a stateless Streamable HTTP server.
- **Actual:** After `initialize`, the SDK client opens a GET for a server stream; a stateless server answers 405, which appears as an error in network logs, though the spec allows it.
- **Severity:** Low. **Workaround:** The simulator labels it "expected" in the debug panel.
- **Suggestion:** Let the client skip the GET when the server says it is stateless, or log the 405 at debug level.

### 8. Bedrock refuses every model with "Error 002" while reporting the model authorized
- **Task:** Use Amazon Bedrock (Nova Lite) as the brain that picks MCP tools.
- **Steps:** Called `Converse` with `us.amazon.nova-lite-v1:0`, then Nova Micro and Claude Haiku 4.5, in us-east-1 and us-west-2. Checked `ListFoundationModels` and `GetFoundationModelAvailability`.
- **Expected:** A response, or an error that says what to do.
- **Actual:** Every call: `ValidationException: Error 002: Access to Bedrock models is not allowed for this account`. At the same time the availability API returned `authorizationStatus: AUTHORIZED`, agreement, entitlement and region all `AVAILABLE`. The IAM user can list models. Public re:Post threads report the same error as an account-level block cleared only through AWS Support, sometimes after weeks.
- **Severity:** High. It removed Bedrock from the live demo three days before the deadline.
- **Workaround:** The offline planner calls the same MCP tools; the Bedrock code ships and is switched on with `BRAIN=bedrock`.
- **Suggestion:** Make the error say why and what to do (for example "account under review, open a support case" with a link), and make `GetFoundationModelAvailability` reflect the block so it can be detected before a build depends on it.

### 9. The deployed cold start is three times the first-result target
- **Task:** Meet the 500 ms first-result guidance on Lambda.
- **Actual:** 1.5 s cold start (512 MB, arm64, 1.6 MB bundle); 135 to 160 ms warm.
- **Severity:** Low for a demo. **Workaround:** Warm the function before recording.
- **Suggestion:** An MCP-on-Lambda guide with cold-start numbers and the cheapest way to stay under 500 ms.
