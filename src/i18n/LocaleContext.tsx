"use client";

import { createContext, useContext } from "react";

import commonEn from "./messages/en/common.json";
import { defaultLocale, type Locale } from "./config";
import { localePath } from "./routing";

export type CommonDictionary = typeof commonEn;

type LocaleValue = {
  locale: Locale;
  /** Navbar, footer, buttons: the copy that appears on every single page. */
  common: CommonDictionary;
};

/**
 * The active locale and the site chrome's strings.
 *
 * Only `common` crosses the server/client boundary, never the whole catalog.
 * That is a deliberate line: `common.json` is ~2 kB and appears on every page,
 * so shipping it once beats drilling nav and footer labels through twelve page
 * components. `home.json`, `pages.json` and the ~6,000-word FAQ stay on the
 * server and reach client sections as ordinary props, which is what keeps them
 * out of the browser bundle.
 *
 * The default value is English rather than `null` so that a component rendered
 * outside the provider (a test, a Storybook story) still has real strings
 * instead of throwing.
 */
const LocaleContext = createContext<LocaleValue>({
  locale: defaultLocale,
  common: commonEn,
});

export function LocaleProvider({
  locale,
  common,
  children,
}: {
  locale: Locale;
  common: CommonDictionary;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ locale, common }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

/** The site-chrome strings for the active language. */
export function useCommon(): CommonDictionary {
  return useContext(LocaleContext).common;
}

/**
 * `href` builder bound to the active locale.
 *
 * Every internal link in a client component goes through this. Miss one and it
 * silently drops a French visitor back onto the English site, which is the
 * single easiest bug to ship in a localised app.
 */
export function useLocalePath(): (path: string) => string {
  const locale = useLocale();
  return (path: string) => localePath(path, locale);
}
