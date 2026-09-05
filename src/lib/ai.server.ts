/** Server-only helper for Google AI Studio structured JSON generation. */

type JsonSchema = Record<string, unknown>;

export async function generateStructured<T>(args: {
  system: string;
  prompt: string;
  schemaName: string;
  schema: JsonSchema;
}): Promise<T> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured yet. Missing GEMINI_API_KEY.");

  const model = process.env["GEMINI_MODEL"] || "gemini-2.5-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: args.system }] },
      contents: [{ role: "user", parts: [{ text: args.prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: args.schema,
      },
    }),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let message = body;
    try {
      message = JSON.parse(body)?.error?.message ?? JSON.parse(body)?.message ?? body;
    } catch {
      /* keep raw */
    }
    if (res.status === 429) throw new Error("The AI is busy right now. Please try again in a moment.");
    if (res.status === 403) throw new Error(message || "Google AI access is blocked for this API key.");
    throw new Error(message || `AI request failed (${res.status}).`);
  }

  const payload = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

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
