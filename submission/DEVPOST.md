# Devpost submission text (draft)

**Project name:** ILORA.ai on Alexa+
**Tagline:** Ask Alexa how your building is really doing, and get checked numbers with the exact line that doesn't add up.
**Track:** Alexa+ (self-hosted MCP server, demonstrated through a simulated Alexa+ client)
**Mini challenges:** AWS Builder (used in the demo: AWS Lambda, Amazon Polly, AWS SAM; an Amazon Bedrock brain is built but not used in the demo, see below) and Open Source (new public repository, MIT license).
**Repository:** https://github.com/gSimani/ilora-alexa-mcp (public, MIT license)
**Video:** [YouTube link after upload]
**Run it:** `npm install && npm run dev`, then open http://localhost:8787. No keys needed. Full steps in the README.

---

## Inspiration

An independent owner's rent roll says $412,000 a year. The income statement says $398,500. Nobody notices the $13,500 gap until a lender or a buyer does, and by then it's a price cut or a delayed refinance. Big owners have analysts who tie these documents out every month. Small owners don't, but most of them have a voice assistant.

There are 5.9 million commercial buildings in the U.S., and 71% of them are 10,000 square feet or smaller (EIA CBECS 2018). In 2026, $875 billion of commercial and multifamily mortgages come due (Mortgage Bankers Association, February 9, 2026), and every refinance re-checks these exact numbers.

## What it does

You ask, by voice, about a property:

- **"How is Coral Wren Plaza doing?"** Occupancy, net operating income for the last 12 months, and how many items need a look.
- **"Does my rent roll match my income statement?"** Both totals, the gap, and each cause ranked by dollars, with the source document, page and line. A Card shows the numbers on screen.
- **"Show me the lines."** The lease clause, the rent roll line and the six statement lines behind the gap, plus the fix.
- **"Which leases expire in the next 90 days?"** Tenant, unit, end date, rent and share of income, as a List. Then "tell me about the second one."

With the screen turned off, every answer still makes sense by voice alone.

## How we built it

- **MCP server, spec 2025-11-25, Streamable HTTP** at `/mcp`, stateless, with the official TypeScript SDK. Five tools, one customer intent each, following Amazon's Alexa+ tool design guide: descriptions say when to call, what returns and what doesn't; every tool declares an `outputSchema` and returns matching `structuredContent`; errors return alternatives ("did you mean Coral Wren Plaza?"); stable ids and positions support follow-ups.
- **MCP Apps** views for the Card and the List, using Alexa+ Visual Foundations token values, light and dark mode, ILORA teal only as an accent.
- **Simulated Alexa+ client.** The Alexa+ MCP Toolkit is invitation-only, so we built the client the FAQ describes: a web page that is a real MCP client (initialize, tools/list, tools/call, resources/read over Streamable HTTP), with push-to-talk, a voice-only mode, an MCP Apps host for the views, and a panel that shows every JSON-RPC message.
- **AWS:** one **AWS Lambda** function (function URL) hosts everything; **Amazon Polly** neural voice reads the answer; **AWS SAM** deploys and tears down. An **Amazon Bedrock** brain (Converse API with tool use) that receives the MCP tool list and picks the tool is built and switched on with one setting, but our AWS account returned Bedrock's account-level "Error 002" for every model, so the demo uses an offline planner that calls the same MCP tools. The simulator shows which brain answered every turn.
- **Data:** a fictional retail center and a fictional apartment community, with issues seeded on purpose. Tests assert every seeded number to the dollar.

## How it maps to the judging criteria

- **Technical implementation:** real MCP server on spec 2025-11-25 over Streamable HTTP; schema-true outputs validated by the SDK client in tests; 43 tests covering every tool (happy path, unknown id, empty result), a golden conversation and latency; warm tool calls answer in 3 to 21 ms on a laptop (measured October 20, 2026).
- **Design:** voice-first answers; one title, two figures and one action on the Card; a homogeneous List; a voice-only toggle; light and dark mode.
- **Potential impact:** the users are owners, brokers and lenders of the millions of small commercial buildings, and the timing is a heavy refinance year.
- **Quality of the idea:** not a chatbot over a spreadsheet. It catches money-losing mismatches and cites the line, built by a company already building this product.

## Challenges we ran into

- The MCP SDK client validates `structuredContent` against the success schema even on error results, so structured errors made the client throw. Errors now carry JSON in text content.
- On Lambda, the Node Streamable HTTP transport behind an Express adapter returned 415. We moved `/mcp` on Lambda to the SDK's web-standard transport.
- Amazon Bedrock refused every model with "Error 002: Access to Bedrock models is not allowed for this account" while its own availability API said AUTHORIZED. We kept the Bedrock code and ran the demo on the offline planner.
- The Alexa+ Card and List templates are documented in prose without code, so we built views that follow the patterns and token values.
- Full list with expected vs actual and suggestions: `submission/FRICTION_LOG.md` in the repo.

## Accomplishments that we're proud of

- The demo never contradicts itself: every seeded number is asserted by a test.
- The answer to "does it match?" names the cause and the page and line, not just the gap.
- Anyone can run the whole thing locally in five minutes with no accounts.

## What we learned

- Writing tool descriptions as "call this when..., returns..., does not..." made tool choice reliable, even for a simple rules-based planner.
- Returning complete data and letting the assistant write the words gives better voice answers than scripting speech.

## What's next for ILORA.ai on Alexa+

- Replace the fixture reader with ILORA.ai's API and account linking, so owners hear about their own properties.
- Join the Alexa+ MCP Toolkit preview and run the same server inside Alexa+.
- More checks: CAM reconciliation, loan covenants (DSCR) and budget variance.

## Built with

TypeScript, Node.js, Model Context Protocol (spec 2025-11-25, Streamable HTTP), MCP Apps, Zod, Express, Vite, Web Speech API, AWS Lambda, Amazon Polly, AWS SAM, Vitest

(An Amazon Bedrock brain is included in the code but was not used in the demo; see Challenges.)

## Built during the submission window

Everything in the repository was written during the submission window, starting October 19, 2026. It is a new, standalone project. ILORA.ai's production extraction and verification engine is not included; the checks here were written for this demo.

## Honesty notes

- The Alexa+ experience is simulated; we do not claim Alexa+ certification.
- All properties, tenants and figures are fictional.

---

Product feedback: see `submission/PRODUCT_FEEDBACK.md`. Friction log and feature requests: `submission/FRICTION_LOG.md` and the feature request table in the product feedback file.

## Open Source mini challenge

- **Contribution URL / project repository URL:** https://github.com/gSimani/ilora-alexa-mcp
- **GitHub username:** gSimani
- **What we did:** a new MIT-licensed project, built during the hackathon window: an MCP server (spec 2025-11-25, Streamable HTTP) with five intent-shaped tools and output schemas, MCP Apps Card and List views using the Alexa+ token values, a browser MCP client that simulates Alexa+ with a JSON-RPC inspector, an AWS Lambda deployment that serves MCP from a function URL, and 43 tests.
- **How it works:** see "How we built it" above and the README.
- **Why it matters:** it is a working reference for two things other Alexa+ builders will hit: serving MCP from AWS Lambda (the Node transport behind an Express adapter returns 415; the web-standard transport works) and hosting MCP Apps views with a minimal host. The friction log documents both.
