# @harborclient/team-hub-api

**Full documentation:** [https://harborclient.github.io/team-hub-api/](https://harborclient.github.io/team-hub-api/)

**TypeScript client for the HarborClient Team Hub API**

`@harborclient/team-hub-api` is a library for typed HTTP access to HarborClient Team Hub collections, environments, folders, and saved requests:

- **Typed HTTP client:** Zod-validated request and response shapes for Team Hub endpoints.
- **Full API coverage:** Collections, environments, folders, saved requests, admin, and session APIs.
- **Capability-aware usage:** Session capabilities guide when to call management vs. user-scoped methods.

## Documentation

| Topic           | Link                                                                     |
| --------------- | ------------------------------------------------------------------------ |
| Getting started | [Introduction](https://harborclient.github.io/team-hub-api/)             |
| Installation    | [Install](https://harborclient.github.io/team-hub-api/install)           |
| Usage           | [Usage](https://harborclient.github.io/team-hub-api/usage)               |
| API reference   | [API coverage](https://harborclient.github.io/team-hub-api/api-coverage) |

Canonical docs live in [`docs/`](./docs/). Edit those pages directly, then run `pnpm docs:build:nav` to refresh the VitePress sidebar.

## Development

```bash
pnpm install
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
pnpm docs:serve    # VitePress dev server with nav watcher
pnpm docs:build    # production docs build
```

## License

MIT
