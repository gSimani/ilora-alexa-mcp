/**
 * Amazon Bedrock brain: the model receives the MCP tool list and decides which
 * tool to call, the way Alexa+ does. Uses the Converse API with tool use.
 * Enabled with BRAIN=bedrock; the model id comes from BEDROCK_MODEL_ID.
 */
import { BedrockRuntimeClient, ConverseCommand, type Tool } from "@aws-sdk/client-bedrock-runtime";
import type { Brain, BrainRequest, Message } from "./types.js";

const SYSTEM = `You are Alexa, answering a commercial property owner by voice.
Use the tools for every number; never guess or estimate a figure.
Answer in one to three short spoken sentences: lead with the answer, round money to the nearest dollar, say percentages with one decimal at most.
When something does not reconcile, say by how much, name the biggest cause and where it came from, then offer to show the lines.
When the customer refers to "the first one" or "the second one", use the position or flag_id from the most recent tool result.
Never read out ids, JSON, tool names or account codes. Mention once, briefly, if asked, that the data is a fictional demo portfolio.`;

export class BedrockBrain implements Brain {
  name: string;
  private client: BedrockRuntimeClient;
  constructor(private modelId = process.env.BEDROCK_MODEL_ID ?? "us.amazon.nova-lite-v1:0", region = process.env.AWS_REGION ?? "us-east-1") {
    this.client = new BedrockRuntimeClient({ region });
    this.name = `bedrock:${modelId}`;
  }

  async next({ messages, tools }: BrainRequest) {
    const toolConfig = {
      tools: tools.map(
        (t): Tool => ({
          toolSpec: {
            name: t.name,
            description: t.description ?? t.name,
            inputSchema: { json: (t.inputSchema ?? { type: "object", properties: {} }) as never },
          },
        }),
      ),
    };
    const out = await this.client.send(
      new ConverseCommand({
        modelId: this.modelId,
        system: [{ text: SYSTEM }],
        messages: messages as never,
        toolConfig,
        inferenceConfig: { maxTokens: 400, temperature: 0 },
      }),
    );
    const message = out.output?.message as unknown as Message;
    const use = message.content.find((b): b is Extract<typeof b, { toolUse: unknown }> => "toolUse" in b);
    if (out.stopReason === "tool_use" && use) return { stop: "tool_use" as const, message, toolUse: use.toolUse };
    const text = message.content
      .filter((b): b is { text: string } => "text" in b)
      .map((b) => b.text)
      .join(" ")
      .trim();
    return { stop: "end_turn" as const, message, text };
  }
}
