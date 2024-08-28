import {locales, pathnames, localePrefix, defaultLocale} from '@/naviagation';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  defaultLocale,
  localePrefix,
  pathnames,
  locales,
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)']
};