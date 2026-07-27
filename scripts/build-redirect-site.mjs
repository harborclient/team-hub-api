#!/usr/bin/env node
/**
 * Builds a GitHub Pages redirect stub site for the archived Team Hub API docs repo.
 *
 * Canonical documentation now lives at https://harborclient.com/team-hub-api/.
 * This script emits HTML redirects so old harborclient.github.io/team-hub-api/… links
 * continue to work.
 */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const siteRoot = join(repoRoot, '_site');
const siteOrigin = 'https://harborclient.com';
const packageSlug = 'team-hub-api';

/** Known doc routes that previously lived on GitHub Pages. */
const routes = ['', 'install', 'usage', 'api-coverage', 'development', 'license'];

/**
 * Builds the harborclient.com destination URL for a docs path.
 *
 * @param {string} routePath Path under the package, or empty for the overview.
 * @returns {string} Absolute destination URL.
 */
function destinationUrl(routePath) {
  if (!routePath) {
    return `${siteOrigin}/${packageSlug}/`;
  }

  return `${siteOrigin}/${packageSlug}/${routePath}`;
}

/**
 * Builds a minimal HTML redirect page that preserves hash fragments.
 *
 * @param {string} destination Absolute URL to redirect to.
 * @returns {string} HTML document contents.
 */
function buildRedirectHtml(destination) {
  const escaped = destination.replace(/"/g, '&quot;');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="0; url=${escaped}" />
    <link rel="canonical" href="${escaped}" />
    <title>Redirecting…</title>
    <script>
      (function () {
        var destination = ${JSON.stringify(destination)};
        location.replace(destination + location.hash);
      })();
    </script>
  </head>
  <body>
    <p>
      Documentation has moved to
      <a href="${escaped}">${escaped}</a>.
    </p>
  </body>
</html>
`;
}

/**
 * Writes redirect HTML for one docs route.
 *
 * @param {string} routePath Path under the package, or empty for the overview.
 * @returns {void}
 */
function writeRedirect(routePath) {
  const destination = destinationUrl(routePath);
  const html = buildRedirectHtml(destination);

  if (!routePath) {
    mkdirSync(siteRoot, { recursive: true });
    writeFileSync(join(siteRoot, 'index.html'), html);
    return;
  }

  const dir = join(siteRoot, routePath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  writeFileSync(join(siteRoot, `${routePath}.html`), html);
}

/**
 * Builds a catch-all 404 that remaps unknown paths under this Pages site.
 *
 * @returns {string} HTML document contents.
 */
function buildCatchAllHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Redirecting…</title>
    <script>
      (function () {
        var match = location.pathname.match(/^\\/team-hub-api(?:\\/(.*))?$/);
        var rest = match && match[1] ? match[1].replace(/\\/$/, '') : '';
        var destination =
          ${JSON.stringify(siteOrigin + '/' + packageSlug + '/')} +
          rest +
          location.search +
          location.hash;
        location.replace(destination);
      })();
    </script>
  </head>
  <body>
    <p>Redirecting to the HarborClient documentation site…</p>
  </body>
</html>
`;
}

rmSync(siteRoot, { recursive: true, force: true });
mkdirSync(siteRoot, { recursive: true });

for (const route of routes) {
  writeRedirect(route);
}

writeFileSync(join(siteRoot, '404.html'), buildCatchAllHtml());
console.log(`Wrote ${routes.length} redirect route(s) plus 404.html to ${siteRoot}`);
