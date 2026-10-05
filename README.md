# nightgate-demo

A small HTTP service written in plain Node (`node:http`, no framework, no
dependencies). It turns text into URL slugs.

| Endpoint | Response |
| --- | --- |
| `GET /health` | `{"ok":true}` |
| `GET /version` | `{"name":"nightgate-demo","version":"1.0.0"}`, read from `package.json` |
| `GET /slug?text=Hello%20World` | `{"text":"Hello World","slug":"hello-world"}` |

`text` is required and at most 200 characters. `separator` is optional:
`-` (the default) or `_`, as in `GET /slug?text=Hello%20World&separator=_`,
which returns `"slug":"hello_world"`. Anything else is a `400`.

Every response carries an `x-request-id` header. A caller's own
`x-request-id` is echoed back when it is 1 to 64 characters of letters,
digits, `.`, `_` or `-`; otherwise the service generates a UUID.

## Run it

```sh
npm start   # listens on $PORT, default 3000
npm test    # node:test, under test/
```

Node 20 or later; `.nvmrc` pins 22.

## Its gate

Every merge to `main` passes through
[Nightgate](https://github.com/NightWatchEng/nightgate): a pull request
lands only when the gate's checks pass and its evidence is recorded against
the commit.
