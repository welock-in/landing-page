import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/utils";

/**
 * Crawlers that answer questions by citing sources.
 *
 * Listed explicitly rather than left to the wildcard, because the wildcard is
 * ambiguous to a human reading the file and to anyone who later adds a
 * `Disallow` without thinking about who it catches. Blocking any of these does
 * not protect anything — it only removes WeLockIn from that assistant's answers
 * while competitors stay in them.
 */
const AI_SEARCH_AGENTS = [
  "GPTBot", // OpenAI — ChatGPT
  "OAI-SearchBot", // OpenAI — ChatGPT search
  "ChatGPT-User", // OpenAI — user-initiated browsing
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot", // Anthropic
  "Claude-User",
  "Claude-SearchBot",
  "Google-Extended", // Gemini and AI Overviews
  "Applebot-Extended",
  "meta-externalagent",
  "Bingbot", // Copilot, via Bing
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // `/blocked` is the in-app interstitial, already `noindex`; keeping
        // crawlers off it saves them the round trip.
        disallow: ["/api/", "/blocked"],
      },
      ...AI_SEARCH_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/", "/blocked"],
      })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/").replace(/\/$/, ""),
  };
}
