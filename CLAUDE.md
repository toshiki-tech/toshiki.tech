# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

toshiki.tech is a multilingual personal/portfolio website built with Next.js 14 (App Router), Tailwind CSS, and TypeScript. It showcases products, client work, and AI experiments. The site supports four locales: English (`en`), Chinese Simplified (`zh`), Japanese (`ja`), and Traditional Chinese (`zh-tw`).

## Commands

- **Dev server:** `npm run dev` (localhost:3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint`

## Architecture

### Internationalization (i18n)

This is the most important architectural pattern in the codebase:

- **Routing:** All pages live under `src/app/[lang]/`. The `[lang]` param is one of `en | zh | ja | zh-tw` (defined as the `Locale` type in `src/lib/get-dictionary.ts`).
- **Middleware** (`src/middleware.ts`): Detects browser locale and redirects bare paths (e.g., `/products` → `/en/products`). Uses `@formatjs/intl-localematcher` + `negotiator`.
- **UI strings:** Stored in JSON dictionary files under `src/dictionaries/{en,zh,ja,zh-tw}.json`. Loaded server-side via `getDictionary(locale)` from `src/lib/get-dictionary.ts`.
- **Content data translations:** Product, work, and experiment data in `src/data/` files embed translations directly in each item's `translations` object (keyed by locale), rather than using the dictionary JSON files.
- **When adding or modifying content, all four locales must be updated.** This applies to both dictionary JSON files and data file translation objects.

### Route Groups

- `src/app/[lang]/(site)/` — Main site pages with shared Navbar + Footer layout (home, about, products, works, ai-lab, work-with-me, privacy, terms)
- `src/app/[lang]/(standalone)/` — Standalone pages with their own layout (e.g., yomiplay)
- `src/app/[lang]/(site)/p/` — Individual product detail pages

### Key Directories

- `src/components/` — Shared layout components (Navbar, Footer, Logo)
- `src/data/` — Static content data with embedded translations (products, works, experiments)
- `src/lib/supabase.ts` — Supabase client (used for backend features)

### Locale Handling for `zh-tw`

The `zh-tw` locale requires special attention because it uses a hyphen. When accessing translations from data objects, use bracket notation: `item.translations['zh-tw']`. Several recent commits have been fixes for incomplete `zh-tw` support — always verify `zh-tw` works when touching locale-dependent code.
