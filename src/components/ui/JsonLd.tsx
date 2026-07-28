/**
 * Renders a JSON-LD graph into the document.
 *
 * Server-rendered on purpose: structured data injected after hydration is
 * invisible to anything that reads the HTML without running scripts, which is
 * most of what we are marking it up for.
 */
export function JsonLd({ graph }: { graph: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: graph }}
    />
  );
}
