---
title: A Markdown editor that adds furigana to Japanese, made for my daughter — YomiNote
date: 2026-05-13
excerpt: A Chinese-speaking fifth-grader living in Japan can read the kanji but can't always pronounce them. YomiNote was built for exactly that.
tags: [YomiNote, Tools, Japanese]
---

My daughter is in fifth grade now, going to school in Japan.

Day-to-day life at school is fine — simple Japanese is no problem, and she can finish her homework. But one thing keeps tripping her up: reading aloud.

Children with a Chinese background learning Japanese run into a curious pattern: **the meanings of kanji are actually the easy part.** She sees 「環境問題」 and can guess it's *environmental issues*. She sees 「交流」 and knows it has something to do with people interacting with each other. Meaning, she gets.

Pronouncing it smoothly — that's the hard part.

Is 「交流」 read as `こうりゅう`? Or something else?

「環境」 is `かんきょう`, right? Then 「問題」 — is it `もんだい`? In Japanese, kanji sometimes take on-yomi readings and sometimes kun-yomi, with finicky rules. Even with the textbook in front of her, she gets one or two readings wrong. The longer the passage, the more exhausting her reading practice becomes — she understands the meaning, but every few characters she has to stop and check the reading.

I wanted to help her with this.

## A blindingly obvious need

The most basic idea:

> Drop the passage she's practicing into a tool. Every kanji gets furigana floating above it automatically. Print it out, or just read it on screen — and focus on practicing fluency.

HTML has had a tag for exactly this — `<ruby>` — for twenty years. Japanese websites use it everywhere, specifically to mark readings on kanji.

But almost no Markdown editor natively supports it — because most people writing Markdown editors simply don't need this feature.

So I decided to write my own Markdown editor.

## What YomiNote does

In short, three things.

**1. Automatic furigana on kanji.**

You don't have to do anything extra. Paste your text into the left pane and every kanji in the right preview floats furigana above it. Under the hood it uses a morphological analyzer called `kuroshiro`, paired with the `kuromoji` Japanese dictionary, running fully offline and resolving in a second.

Print it and you have a furigana-annotated reading sheet; don't print and just push the screen toward her — same effect.

**2. English glosses on katakana loanwords.**

Japanese has piles of loanwords like 「コンピュータ」, 「オフィス」, 「インターフェース」 that are warped phonetic transcriptions of English. But recognizing the katakana doesn't mean instantly recognizing which English word it is — my daughter has to sound out 「マネージャー」 three times before realizing it's "manager."

YomiNote quietly tags the original English word above the katakana in the preview. Recognition speed jumps immediately, and that little *"oh, that's what it is"* moment happens several times per passage.

This part relies on JMdict — an open-source Japanese dictionary maintained by the community for thirty years. That alone is something worth respecting.

**3. A small custom ruby syntax.**

Sometimes I want to add a reading to something that isn't a kanji — a person's name, a place name, a made-up term. I designed a `{base|reading}` syntax that's not verbose to write but renders into clean ruby annotation:

```markdown
Had a meeting in {渋谷|しぶや} today, met a {マネージャー|manager}.
```

Three characters of syntax. Zero learning curve.

## Works offline

YomiNote has no cloud, no account, no network connection.

The technical reason is simple: the tokenizer dictionary and the katakana JSON aren't large; there's no reason to keep them on a remote server and make the user wait on an HTTP request every time they open a note. And because a fixed tokenizer sometimes can't tell on-yomi from kun-yomi, a disclaimer I should make explicit:

**This tool mainly provides furigana typesetting assistance — it cannot guarantee the readings are always correct. Always verify and edit manually.**

Your Markdown files just live on your local machine. You can choose to sync them to cloud storage yourself if you want.

## Written for the people who "can't quite pronounce it"

The tools I make are small tools — not meant for everyone.

But behind each one is a specific, concrete little problem. The problem YomiNote stands behind is a fifth-grader living in Japan, who understands the kanji but can't quite pronounce the Japanese — she doesn't need a smarter AI. She needs **a quiet sheet of paper with the readings already marked**.

I spent a weekend coding. And that's how YomiNote came to be.

If there's someone like her near you — a kid, a student, yourself — this tool is for them.

**Important disclaimer: This tool only assists with reading annotations. It cannot guarantee perfect accuracy. Always verify and edit manually.**
