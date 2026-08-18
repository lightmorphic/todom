# Changelog

All notable changes to Todom are documented in this file.

## 1.0.0 - 2026-08-18

Initial release of Todom: a stupidly simple todo list.

### Features
- Clean, minimal interface with dark/light mode (follows system
  preference, manual toggle remembered per browser)
- Every task has a due date; active tasks are sorted nearest-due first
- Colour-coded urgency (overdue / due today / due soon / later)
- Completion date recorded automatically when a task is checked off
- Import/Export of the task list as JSON
- Installable PWA (works offline, "Add to Home Screen")
- Server-side storage in a single JSON file via a small Node/Express
  backend, so every device sees the same task list
- Docker image published to `ghcr.io/lightmorphic/todom` on every push
  to `main`, with a weekly rebuild to pick up patched OS packages
