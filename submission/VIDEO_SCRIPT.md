# Demo video script (target 2:40, hard limit under 3:00)

Rules this follows: strongest material first, real screen recording of the running simulator, captions on, English, no music, no stock footage, no third-party logos or trademarks beyond naming the Amazon services used. Data is fictional and the video says so once.

**Before recording**
- Run `npm run dev` (or the Lambda URL if deployed) and open the simulator full screen at 1440 x 900, Dark on, Screen on.
- Ask each demo question once off camera so everything is warm. Reload the page so the conversation starts empty.
- Run with the Polly voice: `VOICE=polly npm run dev` (your AWS credentials, about a cent per recording), or redeploy to Lambda with the command in GUY_CHECKLIST.md. The header should read `brain: offline-planner · voice: polly:Ruth`. Decision 10/19: no Bedrock in the demo or the video.
- Use a good microphone; speak the questions out loud with **Hold to talk**.

| Time | On screen | Voice-over / spoken |
|---|---|---|
| **0:00-0:15** The problem | Two numbers side by side on a plain slide: **Rent roll $412,000** · **Income statement $398,500** | "An owner's rent roll says $412,000 a year. The income statement says $398,500. Nobody notices the $13,500 gap until a lender or a buyer does. Small owners don't have analysts. They do have a voice assistant." |
| **0:15-0:25** Pitch | Simulator, title "ILORA.ai on Alexa+" | "This is ILORA.ai on Alexa+. Ask how your building is really doing, and get checked numbers, with the exact line that doesn't add up and where it came from." |
| **0:25-0:45** Snapshot | Hold to talk: *"How is Coral Wren Plaza doing?"* Answer appears and is spoken. | (Let the answer play: 92.1% occupied, NOI $331,260, 2 items to check.) |
| **0:45-1:10** The wow moment | Hold to talk: *"Does my rent roll match my income statement for Coral Wren Plaza?"* The Card appears on the right: $412,000, $398,500, gap $13,500, two causes with document, page and line. | (Let the answer play.) Then: "Two causes, ranked, each with the source page and line." |
| **1:10-1:25** Show the lines | Tap **Show the lines** on the Card (or say *"Yes, show me the lines"*). | (Answer: the March 2026 step, page and line, and the fix.) |
| **1:25-1:40** Expiring leases | *"Which leases expire in the next 90 days at Tamarind Grove?"* List appears. Then *"Tell me about the second one."* | (Answers: 3 leases, 9% of income; then Unit B-23.) |
| **1:40-1:52** Voice only | Untick **Screen**. Ask *"Does my rent roll match my income statement for Coral Wren Plaza?"* again. Only the caption shows. | "With no screen, the answer stands on its own. Every tool returns complete data, and Alexa writes the words." |
| **1:52-2:20** Under the hood | Click **Show JSON-RPC**. Expand `initialize` (protocolVersion 2025-11-25), `tools/list`, one `tools/call`, one `resources/read`. Then the header line: brain and voice. Then the AWS Lambda console page for the function (optional). | "Under the hood: a self-hosted MCP server, spec 2025-11-25, over Streamable HTTP. The page is a real MCP client: initialize, list tools, call tools. Five intent-shaped tools, each with an output schema. The Card and the List are MCP Apps views. A planner picks the tool, Amazon Polly speaks, and it all runs on one AWS Lambda function. A Bedrock brain is built in and switches on with one setting. The Alexa+ developer tools are invitation-only, so this page simulates Alexa+, and the properties are fictional." |
| **2:20-2:40** Why it matters | Plain slide with two figures | "There are 5.9 million commercial buildings in the U.S., and 71% of them are 10,000 square feet or smaller. In 2026, $875 billion of commercial and multifamily mortgages come due, and every refinance re-checks these numbers. Ask Alexa how your building is really doing. ILORA.ai on Alexa+." |

**Captions:** turn on auto-captions after upload and correct the numbers ($13,500, $412,000, $398,500, 92.1%, 9%).

**Sources for the closing figures** (say them in the Devpost text, not in the video):
- EIA, Commercial Buildings Energy Consumption Survey 2018, Table B6: 5,918 thousand buildings; 2,833 + 1,359 thousand are 1,001 to 10,000 sq ft (70.8%).
- Mortgage Bankers Association, February 9, 2026: "Seventeen percent ($875 billion) of the $5.0 trillion of outstanding commercial mortgages held by lenders and investors is scheduled to mature in 2026."

**Upload:** YouTube or Vimeo, visibility **Public**, English title "ILORA.ai on Alexa+: checked property numbers by voice", length under 3:00.
