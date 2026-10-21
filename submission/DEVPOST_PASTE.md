# Devpost form: paste-ready text

Field by field, in the order the Devpost form shows them (Project overview → Project details → Additional info). Character limits are the ones the form enforces. Replace `[VIDEO URL]` after uploading the video. Items marked **(you)** are statements only the entrant can make.

---

## Step 1: Project overview

**Project name** (60 max)

```
ILORA.ai on Alexa+
```

**Elevator pitch** (200 max; this is 168)

```
Ask Alexa how your building is really doing. ILORA.ai checks the rent roll against the income statement and tells you which number doesn't match and where it came from.
```

**Thumbnail:** use an image that shows the fictional names Coral Wren Plaza or Tamarind Grove, or no property name at all.

---

## Step 2: Project details

**About the project** (Markdown)

```markdown
## Inspiration
An independent owner's rent roll says $412,000 a year. The income statement says $398,500. Nobody notices the $13,500 gap until a lender or a buyer does, and by then it's a price cut or a delayed refinance. Big owners pay analysts to tie these documents out every month. The owner of one strip center or a 48-unit apartment building doesn't have an analyst, but they do have a voice assistant.

There are 5.9 million commercial buildings in the U.S., and 71% of them are 10,000 square feet or smaller (EIA, CBECS 2018, Table B6). In 2026, $875 billion of commercial and multifamily mortgages come due (Mortgage Bankers Association, February 9, 2026), and every refinance re-checks these numbers.

## What it does
You ask about a property out loud:
- **"How is Coral Wren Plaza doing?"** Occupancy (92.1%), net operating income for the last 12 months ($331,260), and how many items need a look.
- **"Does my rent roll match my income statement?"** Both totals, the gap, and each cause ranked by dollars, with the source document, page and line: $9,000 from a March rent step for Suite 104 that was never billed, and $4,500 from a CAM reconciliation posted to base rent. A Card shows the numbers on screen.
- **"Show me the lines."** The lease clause, the rent roll line and the statement lines behind the gap, plus the fix.
- **"Which leases expire in the next 90 days at Tamarind Grove?"** Three leases, 9% of rent roll income, as a List. Then "Tell me about the second one."

With the screen turned off, every answer still makes sense by voice alone. Both properties, all tenants and every number are fictional.

## How we built it
- **MCP server, spec 2025-11-25, over Streamable HTTP** at `/mcp`, stateless, built with the official TypeScript MCP SDK. Five tools, one customer intent each, following the Alexa+ tool design guide: every tool declares an output schema and returns matching structured data, errors suggest alternatives ("did you mean Coral Wren Plaza?"), and stable ids and positions support follow-up questions.
- **MCP Apps** Card and List views, using the Alexa+ Visual Foundations token values, in light and dark mode.
- **Simulated Alexa+ client.** The Alexa+ MCP Toolkit is invitation-only, so we built the client the hackathon FAQ describes: a web page that is a real MCP client (initialize, tools/list, tools/call, resources/read over Streamable HTTP), with push-to-talk, a voice-only mode, a host for the MCP Apps views, and a panel that shows every JSON-RPC message.
- **AWS:** **AWS Lambda** (function URL) serves the MCP endpoint and the simulator, **Amazon Polly** reads answers in a neural voice, and **AWS SAM** deploys and removes the stack with one command each. In the demo, a rules-based planner picks the tool. An Amazon Bedrock planner is also in the code, but our AWS account was blocked from Bedrock, so it is not used in the demo (see Challenges).
- **Tests:** 43 tests cover every tool (normal answer, unknown id, empty result), the schemas, a five-question demo conversation and latency. Warm tool calls take 3 to 21 ms on a laptop.

## Challenges we ran into
- **Amazon Bedrock refused every model** with "Error 002: Access to Bedrock models is not allowed for this account", while its own availability API said the model was authorized. We kept the Bedrock code and ran the demo on the rules-based planner, which calls the same MCP tools.
- **The MCP SDK client rejects error results** when a tool has an output schema, so structured errors made the client throw. Errors now carry their JSON in text content.
- **On Lambda, the MCP endpoint returned 415** behind an Express adapter. We moved `/mcp` on Lambda to the SDK's web-standard transport.
- **The Alexa+ Card and List templates are described in prose, not code,** so we built views that follow the patterns and token values.

## Accomplishments that we're proud of
- The demo never contradicts itself: a test checks every seeded number to the dollar.
- The answer to "does it match?" names the cause and the page and line, not just the gap.
- Anyone can run it locally in five minutes with no accounts or keys.

## What we learned
- Writing each tool description as "call this when…, returns…, does not…" made tool choice reliable, even for a simple planner.
- Returning complete data and letting the assistant write the words gives better voice answers than scripting speech.

## What's next for ILORA.ai on Alexa+
- Connect to the ILORA.ai API with account linking, so owners hear about their own properties.
- Join the Alexa+ MCP Toolkit preview and run the same server inside Alexa+.
- More checks: CAM reconciliation, loan covenants (DSCR) and budget variance.
```

**Built with** (tags, comma-separated)

```
typescript, node.js, model-context-protocol, mcp-apps, zod, express, vite, web-speech-api, aws-lambda, amazon-polly, aws-sam, vitest, alexa
```

**"Try it out" links**

```
https://github.com/gSimani/ilora-alexa-mcp
```

**Image gallery:** replace any image made before October 20 that shows the earlier demo property names or says Amazon Bedrock picks the tool. The earlier names belong to real properties, and Bedrock was not used in the demo. The README GIF frames (`docs/demo.gif`) are safe to use.

**Video demo link**

```
[VIDEO URL]
```

---

## Step 3: Additional info

**Upload a file:** leave empty.

**Submitter Type:** `Organization`

**Organization Name** (you)

```
Ilora AI, Inc.
```

**Submitter Country of Residence** (you): select your country.

**Canadian province**

```
N/A
```

**Primary Track(s):** `Alexa+`

**Code repository URL**

```
https://github.com/gSimani/ilora-alexa-mcp
```

**New or existing prior to August 31, 2026?** `New`

**If existing, what was updated:** leave empty, or:

```
New project. Every file in the repository was written during the submission window, starting October 19, 2026. It does not include ILORA.ai's production code.
```

**AWS Builder Mini Challenge?** `Yes`

**Which AWS services did you incorporate and how?**

```
Used in the demo:
- AWS Lambda (function URL, Node.js 22, arm64): one function serves the MCP endpoint (/mcp, Streamable HTTP, spec 2025-11-25), the simulated Alexa+ client and the speech route. On Lambda, /mcp uses the MCP SDK's web-standard transport (src/lambda.ts). Measured on the deployed function: 1.5 s cold start, 135 to 160 ms warm tool calls including network. At most two instances run at once, and the paid routes have hourly request caps.
- Amazon Polly (neural voice "Ruth"): /api/speak reads each answer aloud; all five demo answers were spoken by Polly on the deployed function.
- AWS SAM / CloudFormation: template.yaml deploys the function with one command and removes it with `sam delete`. Polly is switched on by a stack parameter.

Built but not used in the demo:
- Amazon Bedrock (Converse API with tool use): src/assistant/bedrock.ts passes the MCP tool list to the model as tool specs and returns the tool to call. Every call from our account returned "Error 002: Access to Bedrock models is not allowed for this account", so the demo uses the rules-based planner, which calls the same MCP tools.

Documentation: README sections "How it works", "Deploy to AWS" and "AWS services used".
```

**Open Source Mini Challenge?** `Yes`

**Contribution URL**

```
https://github.com/gSimani/ilora-alexa-mcp
```

**Project Repository URL**

```
https://github.com/gSimani/ilora-alexa-mcp
```

**GitHub Username**

```
gSimani
```

**What you did, how it works, why it matters**

```
What we did: a new MIT-licensed repository, written during the hackathon window: an MCP server (spec 2025-11-25, Streamable HTTP) with five intent-shaped tools and output schemas, MCP Apps Card and List views using the Alexa+ token values, a browser MCP client that simulates Alexa+ and shows every JSON-RPC message, an AWS Lambda deployment that serves MCP from a function URL, and 43 tests.

How it works: the browser page connects to /mcp, lists the tools, and calls them over Streamable HTTP. The server reads a fictional rent roll, operating statement and lease abstracts, reconciles them, and returns structured results with source citations. Two tools link to MCP Apps views that the page renders inline. The same code runs locally (npm run dev) and on Lambda (sam deploy).

Why it matters: it is a working reference for problems other MCP and Alexa+ builders will hit: serving MCP from a Lambda function URL (the Node transport behind an Express adapter returns 415; the web-standard transport works), returning structured errors that strict MCP clients accept, and hosting MCP Apps views with a minimal host. The friction log documents each one.
```

**[Optional] Feature Requests**

```
1. Open the Alexa+ MCP Toolkit Web Simulator to hackathon participants, even read-only. We could show the server inside real Alexa+ instead of a simulation. Priority: Critical.
2. Publish the Card and List templates as code (npm package or HTML) with the token CSS variables and limits. Our views would match Alexa+ exactly instead of following prose. Priority: Important.
3. One documented latency target for MCP tool calls. We designed to the 500 ms first-result guidance on the Carousel page; a single stated target removes guesswork. Priority: Important.
4. MCP SDK client: skip output-schema validation for results where isError is true, as the server already does. Structured errors would reach the model intact. Priority: Important.
5. A Lambda function URL example for the MCP SDK's web-standard transport. It would have saved the 415 detour. Priority: Nice-to-have.
```

**[Optional] Friction Log**

```
1. Alexa+ docs point to tools participants can't get (Medium). Task: register a self-hosted MCP server with Alexa+. Expected: a path to connect, or a clear note that the toolkit is gated. Actual: setup pages describe `alexa-ai deploy`; the select-partners-only status is only on the add-ons home page and the FAQ. Workaround: simulated client, as the FAQ allows. Suggestion: a "preview, select partners only" banner on every toolkit setup page, linking to the simulated-experience path.

2. Card and List templates have no code-level spec (Medium). Task: build MCP Apps visuals with the provided templates. Expected: a package, HTML skeleton or schema with field limits. Actual: prose descriptions and token values only. Workaround: hand-built views using the token values. Suggestion: publish the templates as code with token CSS variables and limits.

3. MCP SDK client validates structuredContent on error results (Medium). Task: return a structured "unknown property" error from a tool with an outputSchema. Expected: the client reads the error. Actual: @modelcontextprotocol/sdk 1.32.1 Client.callTool validated the error against the success schema and threw -32602. Workaround: error JSON in text content only. Suggestion: skip client output validation when isError is true.

4. MCP endpoint behind an Express-on-Lambda adapter returns 415 (Medium). Task: run the same Express app on Lambda with a function URL. Expected: same behavior as local. Actual: every /mcp POST returned "415 Unsupported Media Type". Workaround: WebStandardStreamableHTTPServerTransport on Lambda. Suggestion: a Lambda function URL example in the SDK README.

5. MCP Apps server helpers target a different SDK package (Low). Task: register views with @modelcontextprotocol/ext-apps helpers. Actual: ext-apps 2.0.3 types import @modelcontextprotocol/server, while the stable SDK is @modelcontextprotocol/sdk 1.32.1. Workaround: set _meta.ui.resourceUri by hand. Suggestion: state which SDK major each ext-apps release supports.

6. MCP Inspector needs a newer Node than the SDK (Low). Actual: Inspector 2.11.0 warns it requires Node 22.19.0 on Node 22.17.0, but works. Suggestion: put the Node floor in the quick-start line.

7. Optional GET stream shows up as an error (Low). Actual: after initialize, the client opens a GET for a server stream; a stateless server answers 405, which shows as an error in browser logs although the spec allows it. Workaround: the simulator labels it "expected". Suggestion: skip the GET for stateless servers, or log the 405 quietly.

8. Bedrock refuses every model while reporting the model authorized (High). Task: use Amazon Bedrock (Nova Lite) to pick MCP tools. Steps: Converse with Nova Lite, Nova Micro and Claude Haiku 4.5 in us-east-1 and us-west-2; ListFoundationModels; GetFoundationModelAvailability. Expected: a response, or an error that says what to do. Actual: "ValidationException: Error 002: Access to Bedrock models is not allowed for this account" on every call, while availability reported AUTHORIZED and AVAILABLE. Workaround: rules-based planner calling the same tools; Bedrock code kept behind BRAIN=bedrock. Suggestion: say why and what to do in the error, and reflect the block in GetFoundationModelAvailability.

9. Deployed cold start is three times the first-result target (Low). Actual: 1.5 s cold start (512 MB, arm64), 135 to 160 ms warm. Workaround: warm the function before a demo. Suggestion: an MCP-on-Lambda guide with cold-start numbers.
```

**[Optional] Project Testing Link**

```
https://github.com/gSimani/ilora-alexa-mcp#run-it-locally-in-five-minutes
No credentials needed: npm install, npm run dev, then open http://localhost:8787.
```

**Feedback Question 1: Which tools, APIs and SDKs did you use and for what?**

```
- Model Context Protocol TypeScript SDK 1.32.1: the MCP server (tools with input and output schemas, resources), the Streamable HTTP transport, and the browser MCP client in the simulator.
- MCP Apps extension (ext-apps 2.0.3): the ui:// Card and List views and the host-to-view message protocol.
- Alexa+ add-on documentation (MCP Toolkit overview, design guide, tool and schema design, visual foundations, functional requirements): tool design, voice-first answers, Card and List patterns, token values.
- MCP Inspector 2.11.0: independent checks of tools/list and tools/call over Streamable HTTP.
- AWS Lambda with a function URL: hosting the MCP server, simulator and speech route.
- Amazon Polly: reading answers aloud in a neural voice.
- AWS SAM: one-command deploy and teardown.
- Amazon Bedrock: built as the tool-picking model, but our account was blocked, so it was not used in the demo.
- Web Speech API: push-to-talk voice input in the browser.
```

**Feedback Question 2: What worked well?**

```
- MCP SDK: spec 2025-11-25 out of the box; stateless Streamable HTTP in a few lines; Zod schemas become JSON Schema in tools/list automatically; client-side schema validation caught a real bug in our tests. Warm tool calls take 3 to 21 ms on a laptop.
- MCP Apps: the spec types made the handshake easy to implement; a view plus a minimal host is about 150 lines.
- Alexa+ docs: the tool and schema design page is short and concrete, and following it shaped all five tools. Visual Foundations gives exact token values.
- Lambda: a function URL is the shortest path to a public HTTPS MCP endpoint; the deployed function answered tool calls in 135 to 160 ms warm.
- Polly: worked on the first call with no setup; a one-sentence answer came back in 0.53 s, and numbers and dollar amounts read naturally.
- SAM: `sam deploy --resolve-s3` deployed in one command, and `sam delete` removed it.
- Inspector: the --cli mode is scriptable and needs no UI.
```

**Feedback Question 3: What needs work?**

```
- MCP SDK: the client validates structuredContent even when isError is true; the Node transport behind an Express-on-Lambda adapter returned 415; no Lambda example in the README.
- MCP Apps: ext-apps server helpers type against @modelcontextprotocol/server, not the stable SDK.
- Alexa+ docs: the toolkit's invitation-only status is easy to miss; Card and List have no code-level template; no single latency target for MCP tool calls.
- Bedrock: every call returned "Error 002: Access to Bedrock models is not allowed for this account" while the availability API said AUTHORIZED; the error gives no reason or next step.
- Lambda: a 1.5 s cold start is three times the 500 ms first-result guidance.
- Polly: nothing blocking; streaming the first audio chunk sooner would help long answers.
- Inspector: needs Node 22.19+ while the SDK runs on older Node 22.
```

**Feedback Question 4: How was onboarding (zero to hello world)?**

```
- MCP SDK: about 30 minutes from npm install to a server listed by Inspector.
- MCP Apps: about an hour, mostly reading the spec types.
- Alexa+ docs: about 1.5 hours across nine pages.
- Lambda and SAM: about 20 minutes from template to a working URL, most of it spent on the 415 issue.
- Polly: minutes; one SynthesizeSpeech call.
- Bedrock: blocked at the first call by the account-level error.
```

**Feedback Question 5: Would you build with these devices and services again?**

```
Yes. The MCP SDK's schema-first design is what makes Alexa-style tool selection reliable, the MCP Apps Card is how we show both numbers and the source line, and Lambda plus Polly gave us a zero-idle-cost deployment with a natural voice. We would join the Alexa+ MCP Toolkit preview to ship this inside Alexa+, and use Bedrock once our account is cleared; the integration is already written.
```

**Eligibility checkboxes** (you): age of majority, eligible jurisdiction, not affiliated with the sponsor or administrator. Only you can confirm these.

**Which AI tools have you leveraged?** (you; edit to match what you used)

```
Claude Code (Anthropic) for planning, writing and testing the code and documentation, and TypeSafe Jev for two quick development cross-checks (hosting choice and question-to-tool routing).
```

**Level of learning** (you): Moderate or Significant.

**Did you gain AI value you can use in your career?** (you): Yes or No.
