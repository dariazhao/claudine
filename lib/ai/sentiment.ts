import Anthropic from "@anthropic-ai/sdk";
import { SentimentLabel } from "@prisma/client";

export interface SentimentResult {
  score: number;
  label: SentimentLabel;
  reasoning: string;
}

const FALLBACK: SentimentResult = {
  score: 0,
  label: "NEUTRAL",
  reasoning: "Sentiment analysis not configured.",
};

export async function analyzeSentiment(
  text: string
): Promise<SentimentResult> {
  if (!process.env.ANTHROPIC_API_KEY) return FALLBACK;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Analyze the emotional tone of this journal entry and return a JSON object with:
- "score": a float from -1.0 (most distressed) to 1.0 (most joyful)
- "label": one of JOYFUL (0.7–1.0), POSITIVE (0.3–0.69), NEUTRAL (-0.29–0.29), CONCERNED (-0.3–-0.69), DISTRESSED (-0.7–-1.0)
- "reasoning": a brief 1-sentence explanation

Journal entry:
"${text.replace(/"/g, "'")}"

Respond with ONLY the JSON object, no other text.`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") return FALLBACK;

    const raw = content.text.trim();
    const parsed = JSON.parse(raw);

    const score = Number(parsed.score);
    const label = parsed.label as SentimentLabel;
    const reasoning = String(parsed.reasoning ?? "");

    if (isNaN(score) || !label) return FALLBACK;

    // Validate label
    const validLabels: SentimentLabel[] = [
      "JOYFUL",
      "POSITIVE",
      "NEUTRAL",
      "CONCERNED",
      "DISTRESSED",
    ];
    if (!validLabels.includes(label)) return FALLBACK;

    return { score: Math.max(-1, Math.min(1, score)), label, reasoning };
  } catch (err) {
    console.error("[sentiment]", err);
    return FALLBACK;
  }
}
