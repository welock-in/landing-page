import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routing";
import { siteUrl } from "@/config/site";
import { renderMarkdown, renderNotFoundMarkdown } from "@/lib/agentDocs";

/**
 * The Markdown half of every page.
 *
 * Never linked and never crawled directly: `proxy.ts` rewrites here when a
 * request negotiates `text/markdown`, or asks for a `.md` URL. The locale is
 * the first slug segment because the proxy has already resolved it, and
 * resolving it twice is how the two halves of the site end up disagreeing
 * about which language a visitor asked for.
 *
 * `/api/markdown/en` is the home page; `/api/markdown/fr/faq/privacy` is the
 * French edition of the privacy FAQ hub.
 */

type Context = { params: Promise<{ slug?: string[] }> };

/**
 * Both representations are cacheable and both are cached per `Accept`, which
 * only works because every response below carries `Vary`. Without it a CDN
 * hands whichever representation it saw first to everyone after: the failure
 * mode is a browser rendering raw Markdown, or an agent parsing div soup.
 */
const CACHE_CONTROL = "public, max-age=0, s-maxage=3600, must-revalidate";
const VARY = "Accept, Accept-Encoding";

function markdownResponse(
  body: string,
  { status = 200, canonical }: { status?: number; canonical?: string } = {},
): Response {
  const headers = new Headers({
    "content-type": "text/markdown; charset=utf-8",
    vary: VARY,
    "cache-control": CACHE_CONTROL,
  });
  // Points the agent at the address a person can open. The Markdown is a
  // representation of that page, not a second page competing with it.
  if (canonical) headers.set("link", `<${canonical}>; rel="canonical"`);
  return new Response(body, { status, headers });
}

export async function GET(_request: Request, context: Context) {
  const { slug = [] } = await context.params;

  const [first, ...rest] = slug;
  const locale: Locale = isLocale(first) ? first : defaultLocale;
  // A slug that opens with a locale has already been split by the proxy;
  // anything else is a direct hit on this route, so take it whole.
  const segments = isLocale(first) ? rest : slug;
  const path = segments.length ? `/${segments.join("/")}` : "/";

  const dict = await getDictionary(locale);
  const body = renderMarkdown(path, locale, dict);

  if (body === null) {
    return markdownResponse(
      renderNotFoundMarkdown(localePath(path, locale), locale),
      { status: 404 },
    );
  }

  return markdownResponse(body, {
    canonical: `${siteUrl}${localePath(path, locale)}`,
  });
}
