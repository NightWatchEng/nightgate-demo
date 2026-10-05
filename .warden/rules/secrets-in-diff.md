---
id: secrets-in-diff
severity: HIGH
engine: python
applies_to:
- '**'
excludes:
- .warden/rules/**
implements:
- hardcoded-credentials
---
Hard-coded credentials: Keys, tokens, and passwords committed as source, which stay valid in history long after the line is deleted.

Written by `warden init` from the guardrail catalog entry `hardcoded-credentials`; `warden catalog show hardcoded-credentials` has its citations.

False-positive cost: A fixture that looks like a key blocks a PR at HIGH severity, so the checker needs a placeholder carve-out and per-rule excludes for the files that quote the patterns themselves.
