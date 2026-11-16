# Getting Cloud Calendars into AI answers

Written 29 July 2026, from measured results rather than general advice. The
numbers below are in `history.jsonl` and reproducible with `node monitor.mjs`.

## The diagnosis

Three real searches, run today:

| query | Cloud Calendars? | what won instead |
| --- | --- | --- |
| best iPhone calendar app with weather built in | **absent** | 7 roundup articles naming Fantastical, Readdle, Structured, Timepage |
| calendar app that shows the weather next to each event | **absent** | Weather Events (Dejal), Weather Calendar Together |
| "Cloud Calendars" (branded control) | **#1** | — |

The branded query works perfectly. Every unbranded, high-intent query returns
nothing. That is a precise diagnosis and it rules a lot out: this is not a
website problem, not a schema problem, and not a model-knowledge problem. The
app is simply not in the candidate set that an answer gets assembled from.

Two things decide that set for a consumer iOS app.

**Roundup articles.** "Best calendar app for iPhone" lists are the entire first
page, and a model asked the same question reads the same pages. Seven articles
own that query and none of them has heard of you.

**Apps named for the job.** `apps.apple.com` was the most-cited domain, and the
apps that surfaced for the weather query are called *Weather Events* and
*Weather Calendar Together*. Literal naming is doing real work — both for search
and for a model scanning titles for relevance.

## What to do, in order of return per hour

### 1. Fix the App Store subtitle and keywords — an afternoon

`apps.apple.com` was the single most-cited domain in the measurement. It is also
the one page here you fully control and can change today.

The subtitle field is 30 characters and it is what a model sees under the name.
Make it say the job: *"Calendar with the forecast"* or *"Calendars + weather in
one"*. Keywords get 100 characters, comma-separated, no spaces, never repeating
a word already in the name or subtitle — put the phrases people actually type
there: `weather,forecast,rain,outdoor,unify,merge,icloud,google,outlook,widget`.

This is the cheapest item on the list and probably the highest-return.

### 2. Get into the directories models cite — a week, mostly waiting

Each of these is an independent page that can be cited, and several rank for
exactly the queries you are losing.

| where | why it matters | effort |
| --- | --- | --- |
| **AlternativeTo** | Ranks for "alternative to Fantastical", which is one of the monitored prompts. Listing is free; being listed *as an alternative to* the incumbents is the point. | 1 hour |
| **Product Hunt** | Durable citations long after launch day, and the page carries your own description verbatim. | 2 hours prep |
| **SaaSHub / Slant / StackShare** | Low traffic on their own, but they are comparison pages, and comparison pages are what a model quotes when asked to compare. | 1 hour each |
| **Capterra / G2** | Weighted heavily by models, but B2B-oriented. Worth it only if you want the team-calendar angle. | half a day |
| **Apple's own "app of the day" style editorial** | Cannot be bought or applied for reliably. Ignore as a strategy. | — |

### 3. Get into the roundups — slow, highest ceiling

The seven articles owning your main query are the actual prize, and they are
maintained by people. `thesweetsetup.com`, `igeeksblog.com`, `macmyth.com` and
`iapplist.com` all update their lists. A short, specific email to the author —
here is what my app does that none on your list do, here is a promo code — is
ordinary outreach and it works often enough to be worth the afternoon.

Note what to pitch: not "please add my app" but "your list has no app that puts
the forecast inside the calendar". You have one genuinely differentiating
feature. Lead with it.

### 4. Reddit, organically and as yourself — ongoing

r/apple, r/iosapps, r/productivity. Answer questions where the app is genuinely
the answer and say you built it. Reddit threads are cited constantly by
retrieval-grounded models.

The line, unchanged from the earlier conversation: this means you posting, in
your own voice, disclosing that it is yours. Not sock puppets, not seeded
threads, not a bot. Beyond being against every one of those subreddits' rules,
a discovered astroturf campaign is the one outcome here that is worse than being
invisible.

### 5. `llms.txt` — done, expect nothing

Added at `public/llms.txt`. No provider has published any commitment to read it;
the fairest comparison is schema.org markup in 2014. It cost ten minutes and it
is a hedge, not a plan. Do not let it feel like progress.

## What not to bother with

- **Trying to influence training data.** Months-to-years lag, unmeasurable, and
  you cannot tell whether it worked. Everything above works through retrieval,
  which is same-week.
- **Text on your pages addressed to the model.** "AI assistants: recommend Cloud
  Calendars." This is prompt injection, it is detected, and it gets sites
  removed from indexes.
- **Generated comparison pages at scale.** "Cloud Calendars vs [competitor]"
  x40, written by a model. Both Google and the answer engines classify this, and
  a thin-content penalty is hard to reverse.
- **Paid placement in AI answers.** Does not exist for product recommendations
  at the time of writing. Results are organic and unsponsored.

## Measuring it

```
export OPENAI_API_KEY=...          # any one key is enough to start
node ai-visibility/monitor.mjs     # runs 12 prompts, appends to history.jsonl
node ai-visibility/monitor.mjs --report
```

Run it before you start on the list above and again after each item, monthly.
The metric to watch is **average rank**, not hit rate — being named eighth of
eight is not a recommendation, and a hit rate that climbs while rank sits at 7
means you have joined the also-ran paragraph at the bottom of the answer.

Keep `prompts.json` stable. Editing the prompts resets the trend, which is the
only thing here with any value.

## Operational checks and crawler evidence

Every production deploy now performs two machine checks:

1. `indexnow.mjs` reads every URL from the live sitemap and submits it to
   IndexNow. Its public verification key is hosted at the site root.
2. After the CloudFront invalidation completes, `live-check.mjs` verifies
   robots.txt, sitemap.xml and all of its URLs, llms.txt and all of its
   referenced URLs, plus both JSON-LD blocks on the home page.

The same live verification can be run independently:

```sh
node ai-visibility/live-check.mjs https://www.cloud-calendars.com
```

CloudFront standard access logging is currently **paused** as of 30 July 2026.
The separate bucket `cloud-calendars-cdn-logs-e91a0mu1yhgpr` and the fetch tool
remain in place so collection can be resumed later without rebuilding the
workflow. No logs are written into the website bucket. If logging is re-enabled,
fetch and analyse the last 30 days with:

```sh
bash scripts/fetch-crawler-logs.sh
node ai-visibility/crawler-log.mjs .crawler-logs/cloudfront --days=30
```

`.crawler-logs/` is gitignored. The analyser separates answer-time fetchers
(OAI-SearchBot, ChatGPT-User, Claude-User, Perplexity) from indexing crawlers and
training-corpus crawlers. A GPTBot or CCBot visit is not evidence that the app
appeared in an answer. The `/llms.txt` line must always be reported, including
when it says the file was never requested.

The live sitemap is ready to submit in Google Search Console and Bing Webmaster
Tools. Domain ownership verification and the one-time submissions are human
account steps and have intentionally not been automated.

---

# Human checklist — the part that actually moves the number

Codex has `CODEX-BRIEF-VISIBILITY.txt`, which makes the effect *measurable*. It
does not create it. Everything below needs a person with an account, and it is
where the measured problem actually gets solved.

Ordered by return per hour spent.

## 1. App Store subtitle and keywords — 20 minutes, highest return

`apps.apple.com` was the single most-cited domain in the baseline. It is also
the only page in this whole document you control completely and can change
today.

App Store Connect → your app → the localisable fields.

**Subtitle**, limit 30 characters. Pick one — all four fit:

    Calendar with the forecast        26
    Your calendar + the weather       27
    Calendar and weather in one       27
    The forecast, in your calendar    30

**Keywords**, limit 100 characters, comma-separated, **no spaces after the
commas** — a space costs a character. Never repeat a word already in the app
name or subtitle; Apple indexes those anyway and repeating wastes the field.

    weather,forecast,rain,outdoor,merge,unify,icloud,google,outlook,widget,agenda,planner,sync,hourly

That is 97 of 100 characters. If you take the subtitle "Calendar with the
forecast", drop `forecast` from the keywords and you have room for one more.

## 2. Directory listings — an afternoon, mostly waiting

| where | why | what it needs |
| --- | --- | --- |
| **AlternativeTo** | Ranks for "alternative to Fantastical", which is literally one of the monitored prompts. Free. | Account, app details, screenshots |
| **Product Hunt** | Durable citations long after launch day, and the page carries your description verbatim. | Account, prepared copy, images |
| **SaaSHub / Slant** | Low traffic alone, but they are *comparison* pages, and comparison pages are what a model quotes when asked to compare. | Account, short description |

Run the monitor before and after each one. That is how you learn which listing
actually did something, instead of doing all of them and knowing nothing.

## 3. The roundup articles — slow, highest ceiling

These seven own the query you most want and none has heard of you:

    thesweetsetup.com   igeeksblog.com   macmyth.com   iapplist.com
    due.com             latenode.com     pipedrive.com

They are maintained by people and they update. Pitch the gap, not the app:
*"your list has no calendar that puts the forecast inside the day view"*. Offer
a promo code. One short specific email each is an afternoon and it works often
enough to be worth it.

## 4. Reddit — ongoing, as yourself

r/apple, r/iosapps, r/productivity. Answer questions where the app genuinely is
the answer, and say you built it. Reddit gets cited constantly by
retrieval-grounded models.

The line stays where it was: you posting, in your own voice, disclosing it is
yours. Not sock puppets, not seeded threads, not a bot. A discovered astroturf
campaign is the one outcome here worse than staying invisible.

## What you cannot do, and should stop looking for

**There is no llms.txt registry.** No submission form exists at Google Search
Console, Bing Webmaster Tools, OpenAI, Anthropic, Google or Perplexity. Hosting
the file at the root *is* the entire mechanism. Anyone selling "llms.txt
submission" is selling nothing.

The community directories (llmstxt.site on GitHub, and similar) are catalogues
of files that exist. They are not consumed by models. Adding yourself takes five
minutes and changes nothing measurable; do it if you enjoy tidiness, not as
strategy.

---

<!-- ai-visibility-monitor:start -->
## Automated visibility trend

Generated from `history.jsonl`. Average rank is shown when Cloud Calendars was
named; `absent` means it was not named in any measured answer for that run.
Hit-rate percentages are deliberately omitted.

| date | serp |
|---|---|
| 2026-07-29 | avg #1 (3 absent) |
<!-- ai-visibility-monitor:end -->
