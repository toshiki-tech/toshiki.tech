# Writing / 技术札记

Drop tech notes here as Markdown files. One file per post per locale.

## File naming

`<slug>.<locale>.md`

- `slug` — the URL slug (`/{locale}/writing/{slug}`). Use kebab-case.
- `locale` — one of `en`, `zh`, `ja`, `zh-tw`.

A single post can have multiple locale files sharing the same slug — e.g. `whisper-on-ios.zh.md` and `whisper-on-ios.en.md`. Each locale's listing page only shows posts available in that locale.

## Frontmatter

```yaml
---
title: 标题
date: 2026-05-13
excerpt: 一两句话的摘要，列表页会用到。
tags: [iOS, Whisper]
---
```

- `title` — required, used in the list and detail header.
- `date` — required ISO date (YYYY-MM-DD). Posts are sorted by date desc.
- `excerpt` — required short summary.
- `tags` — optional array.

## Body

Standard GitHub-flavored Markdown. Fenced code blocks get syntax-highlighted (`rehype-highlight`).

````markdown
```ts
const greeting = 'こんにちは';
```
````
