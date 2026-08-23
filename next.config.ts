import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /**
     * Lets `app/global-not-found.tsx` answer URLs that match no route at all.
     *
     * The regular `not-found.tsx` convention is no use here: it renders inside
     * a layout, and this app's only root layout sits under the `[lang]`
     * segment, so an unmatched URL never reaches one. Without this flag the
     * site falls back to Next's built-in 404, which is a correct status code
     * and nothing else.
     */
    globalNotFound: true,
  },
};

export default nextConfig;
