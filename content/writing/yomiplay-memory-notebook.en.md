---
title: Can't Keep Up When Coworkers Talk Fast? I Turned Meeting Recordings Into My Own AI Japanese Flashcard Notebook
date: 2026-07-20
excerpt: Struggling to keep up with fast-talking coworkers in Japanese meetings is what pushed me to build YomiPlay's "flashcard notebook" feature. This Marine Day essay walks through how I turn meeting recordings and everyday unfamiliar words into themed notebooks, let AI fill in the explanations (or generate a whole notebook from a single prompt), and test myself in several ways to see if it actually stuck.
tags: [YomiPlay, Japanese Learning, Flashcards, AI]
---

I still freeze up in meetings more often than I'd like.

Progress updates are fine — I can prepare for those in advance. But the moment it turns into a real-time back-and-forth with coworkers, I start falling behind.

Two things happen at once. My Japanese coworkers talk fast, so I often can't catch what they're saying and don't have time to react. And what I want to say myself still doesn't come out smoothly.

We build IT products, and in our daily standups, everyone uses Japanese to confirm requirements, discuss technical approaches, and debrief after releases. The industry jargon, sentence patterns, and spoken expressions that come up constantly are rarely taught in textbooks, and dictionaries don't give you the specific context they're used in.

If you don't catch it, you don't catch it. Once the meeting ends, the words and sentences you missed just drift away with it.

I originally started building YomiPlay to solve a pretty basic problem:

Record the Japanese I couldn't follow in meetings, turn it into subtitles, and let myself go through it line by line — reading and shadowing each sentence.

But I quickly realized that reading subtitles alone wasn't enough.

Even after going through the subtitles, a lot of it still slips away. The real problem was never just "did I hear it clearly" — it's "can I actually remember it."

You can replay the audio and practice listening and reading against the subtitles as many times as you want, but time is limited. Rather than relearning an entire passage from start to finish, I found it far more effective to pull out the words and sentences that are still unfamiliar but genuinely important, sort them by category, and drill them repeatedly.

So I started doing something specific:

Pulling out unfamiliar words and sentences from meetings and everyday life, and organizing them by topic into notebooks of my own.

I gave the idea a name: a "memory notebook."

## From "meetings I couldn't follow" to "my own knowledge base"

I import my daily standup recordings into YomiPlay, which automatically transcribes them into Japanese subtitles.

I pick out the technical terms that keep coming up, the set phrases used in dev standups, and the grammar points I never quite feel confident about, and organize them into a notebook called "Work Japanese for IT."

I set aside ten or so minutes every day: run through the new entries in the notebook, then review whatever's due that day.

It's a lightweight daily habit, but over time, meeting content that I could once only "sort of" follow has become mostly understandable.

More importantly, every word and sentence in there is something I actually encountered in a real work situation — not an example sentence a textbook made up to illustrate a grammar rule. So when I actually need to say it out loud myself, it comes out unusually naturally.

Over time, I realized this approach wasn't only useful for meeting recordings.

In everyday life, we run into words we don't know all the time.

A sign on the street, a screenshot a friend sends, a line in an instruction manual, a notice from school or work.

So I added a photo-recognition feature.

When I come across something I don't recognize, I just take a photo with my phone, and the app automatically recognizes the text and adds it straight to the notebook.

Walking down the street, riding the subway, even standing in line — I can casually collect unfamiliar words into my own knowledge base.

You can quickly check the reading and meaning of a word or phrase, then file it into whichever notebook you're currently focused on, and revisit it later.

Otherwise, a lot of things you look up once and study once still won't stick — and the next time you run into them, you're back to square one.

## When my own notes aren't detailed enough, let AI fill in the gaps

As I organized vocabulary entry by entry, I ran into another problem.

Some words I know how to read and roughly know the meaning of, but I can't quite explain how they're actually used. Sometimes I can't tell how they differ from a near-synonym, or in what situations they sound natural.

So I added an AI assist feature.

Users can configure their own AI API key — it currently supports OpenAI, as well as several mainstream AI providers based in mainland China.

When my own definition isn't detailed enough, I can ask AI to fill in a more complete explanation, clarify the difference between near-synonyms, and generate a few example sentences that are more natural and closer to real usage.

It works like an on-call Japanese teacher, dedicated to filling in exactly the parts of your own notes you haven't fully worked out yet.

## Going further: letting AI generate an entire notebook from scratch

Once I got this far, another question came up.

What if the thing I want to learn isn't something I'd normally encounter at all?

For example, if I want to systematically memorize Japan's prefectures, there's no real need to go hunting for reference material and enter it entry by entry.

Or if I want to learn the slang and buzzwords Japanese young people are using lately — that kind of content won't necessarily show up in a work meeting, but I genuinely want to learn it.

So I built an "AI one-tap notebook generation" feature.

Just tell the AI a topic — "Japan's prefectures," "common expressions in Japanese dev meetings," or "slang young Japanese people use" — and it generates an entire notebook of related vocabulary and sentences.

Each entry can include a reading, a definition, and example sentences. Once it's generated, you can add it straight to your study plan and start memorizing right away.

Whatever you want to learn, you just have to say so — and you get a notebook made specifically for you.

## Testing whether it actually stuck, at your own pace, in several different ways

As the number of notebooks grew, I added a "study plan" layer on top.

You can add the notebooks you want to learn to a plan, then study a set number of new entries each day at your own pace, while reviewing what you've already learned — instead of getting buried under a mountain of vocabulary all at once.

To test whether something actually stuck, I designed a few different practice modes.

The first: look at the original and try to recall the translation, to check whether you truly understand what the sentence means.

The second: look at the translation and try to recall the original, to check whether you can actively say or write the corresponding Japanese.

The third: speak the answer directly into your phone. The app converts what you said into text and matches it against pronunciation and content. Answer correctly, and it's automatically marked "remembered."

In situations where speaking out loud isn't convenient, you can type the answer instead and still complete the test the same way.

Finally, if you've put together a notebook you're really happy with, you can export it and share it with a friend or classmate. Once they import it, they can start studying right away.

Good things are still worth sharing with good friends.

## Closing thoughts

I originally built YomiPlay to solve one specific problem of my own:

What do I do when I can't follow meetings?

But as I kept building it, I realized this is a struggle shared by a lot of Japanese learners.

Language-learning material tends to be fragmented and highly situational.

We might catch a sentence in a meeting, see a word on the street, come across an expression in casual conversation, or stumble onto a topic we're genuinely curious about.

But real memorization and internalization requires a system that can gradually turn those fragments into something organized.

If you're also someone stumbling through real-world situations while learning Japanese — whether in work meetings, in everyday life, or because you just want to systematically learn some topic — I hope YomiPlay's memory notebook can help.

An essay written on Marine Day. Good luck to all of us fellow learners.

## Try the flashcard notebook feature

- **iOS users:** search for YomiPlay on the [App Store](https://apps.apple.com/jp/app/yomiplay/id6760715932) to download
- **Android users:** grab the APK straight from the [download page](/en/yomiplay/download)
- Want the full feature tour first: see the [YomiPlay product page](/en/p/yomiplay)

> Developed with care by Toshiki.Tech
