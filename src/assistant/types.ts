/**
 * Wire format between the simulator (the MCP client) and the brain.
 * It is the Amazon Bedrock Converse message shape, so the Bedrock brain can pass
 * it straight through and the offline planner reads the same thing.
 */
export type TextBlock = { text: string };
export type ToolUseBlock = { toolUse: { toolUseId: string; name: string; input: Record<string, unknown> } };
export type ToolResultBlock = {
  toolResult: { toolUseId: string; status?: "success" | "error"; content: ({ json: unknown } | { text: string })[] };
};
export type Block = TextBlock | ToolUseBlock | ToolResultBlock;
export type Message = { role: "user" | "assistant"; content: Block[] };

/** A tool as returned by MCP tools/list. */
export type McpTool = { name: string; description?: string; inputSchema: Record<string, unknown> };

export type BrainRequest = { messages: Message[]; tools: McpTool[] };
export type BrainReply =
  | { stop: "tool_use"; message: Message; toolUse: ToolUseBlock["toolUse"]; brain: string; ms: number }
  | { stop: "end_turn"; message: Message; text: string; brain: string; ms: number };

export interface Brain {
  name: string;
  next(req: BrainRequest): Promise<Omit<BrainReply, "brain" | "ms">>;
}
