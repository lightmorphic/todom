# Changelog

All notable changes to Todom are documented in this file.

## 1.2.0 - 2026-09-20

### Changed
- Todom is now dark only. The light theme and the theme switcher have
  been removed, along with the stored `todom-theme` preference (offline
  cache bumped to `todom-cache-v3`).
- Website address moved to todom.lightmorphic.com, which is the domain
  that actually points at GitHub Pages.

### Added
- Sticky top menu on the website, with the Lightmorphic app launcher as
  the last item on the right.
- Legal pages (privacy, cookies, terms, accessibility, complaints) and a
  legal sub-footer on the website.

## 1.1.0 - 2026-08-18

### Changed
- New logo: a yellow rounded square with a todo-list glyph, replacing
  the checkmark mark that was shared with an earlier project. Favicon,
  PWA icons, the in-app header icon and the website all updated
  (offline cache bumped to `todom-cache-v2` so installed PWAs pick up
  the new icon).
- Default host port in the Compose file, README and website changed
  from 4080 to 4070. The container port stays 3000; existing installs
  keep whatever mapping they already use.

### Added
- Product website at [todom.lightmorphic.com](https://todom.lightmorphic.com),
  with a live interactive demo of the interface.

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
