# CLAUDE.md

This file provides guidance for AI assistants (Claude, etc.) working in this repository.

## Repository Overview

This is a newly initialized, empty Git repository. It currently contains only a `.gitkeep` placeholder file and has no source code, dependencies, or configuration yet.

**Repository:** EFOCE/Test
**Remote:** `http://local_proxy@127.0.0.1:61652/git/EFOCE/Test`

## Current State

- No source code or project files exist yet
- No package manager, build system, or language framework has been established
- The repository is a blank slate ready for a new project

## Git Conventions

### Branch Naming

- Claude session branches follow the pattern: `claude/<session-id>`
- The main integration branch is `main`
- Feature development should target `main` or `master` (check with maintainer)

### Commit Signing

Commits in this repository are automatically signed using SSH keys. Do not bypass signing with `--no-gpg-sign`.

### Push Instructions

Always push with the upstream flag:

```bash
git push -u origin <branch-name>
```

## Development Setup

> **Note:** This section should be updated once a project is initialized.

When a project stack is chosen, document here:
- How to install dependencies
- How to run the development server
- How to run tests
- How to build for production

## Code Conventions

> **Note:** This section should be updated once the codebase is established.

When source code is added, document here:
- Language(s) and framework(s) in use
- Code style and formatting rules
- Linting configuration
- Test patterns and coverage requirements

## Working with Claude Code

### Session Branches

Claude works on branches named `claude/<session-id>`. Each session creates its own isolated branch. Changes are committed and pushed to these branches for review before merging.

### Guidelines for AI Assistants

1. **Read before editing** — Always read a file before modifying it
2. **Minimal changes** — Only change what is necessary for the task
3. **No unused code** — Do not add dead code, unused imports, or placeholder comments
4. **Commit often** — Make small, focused commits with clear messages
5. **Do not force-push** — Avoid destructive git operations unless explicitly requested
6. **Check before deleting** — Investigate unfamiliar files before removing them
7. **Security** — Never commit secrets, credentials, or sensitive configuration values

## Notes

This CLAUDE.md was auto-generated on 2026-03-06 by Claude Code based on the current state of the repository. Update this file as the project evolves to keep it accurate and useful.
