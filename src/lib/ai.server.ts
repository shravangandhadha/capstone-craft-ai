/**
 * Server-only helper for calling the Lovable AI Gateway Responses API
 * with strict structured JSON output. Streams (required) and returns parsed JSON.
 */

type JsonSchema = Record<string, unknown>;

export async function generateStructured<T>(args: {
  system: string;
  prompt: string;
  schemaName: string;
  schema: JsonSchema;
}): Promise<T> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured yet. Missing LOVABLE_API_KEY.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: "openai/gpt-5.6-sol",
      stream: true,
      instructions: args.system,
      input: args.prompt,
      reasoning: { effort: "low", summary: "auto" },
      text: {
        format: {
          type: "json_schema",
          name: args.schemaName,
          strict: true,
          schema: args.schema,
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let message = body;
    try {
      message = JSON.parse(body)?.error?.message ?? JSON.parse(body)?.message ?? body;
    } catch {
      /* keep raw */
    }
    if (res.status === 429) throw new Error("The AI is busy right now. Please try again in a moment.");
    if (res.status === 402)
      throw new Error(message || "AI credits are exhausted. Please add credits to continue.");
    if (res.status === 403) throw new Error(message || "AI access is blocked for this workspace.");
    throw new Error(message || `AI request failed (${res.status}).`);
  }

  if (!res.body) throw new Error("AI returned an empty response.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload);
        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
          text += evt.delta;
        } else if (evt.type === "response.completed" && typeof evt.response?.output_text === "string") {
          if (!text) text = evt.response.output_text;
        }
      } catch {
        /* ignore partial event */
      }
    }
  }

  if (!text.trim()) throw new Error("The AI did not return a result. Please try again.");

  try {
    return JSON.parse(text) as T;
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1)) as T;
    throw new Error("The AI result could not be read. Please try again.");
  }
}
