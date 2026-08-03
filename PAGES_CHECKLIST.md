# Tech2Xplore — Company & Legal Pages Checklist

Requested alongside the Team and Testimonials pages (both built this
session). This is the rest of the list — not built yet, just scoped so
nothing gets forgotten.

---

## A. Company / marketing pages

Beyond Team and Testimonials, a service-based + platform company
typically needs:

- **Services / What We Do** — a real breakdown of the consulting side
  (contract web/software dev, consulting, digital marketing, platform
  promotion, per the homepage's "Beyond the Platform" section) with
  enough detail that a prospect knows if you're a fit before they
  reach out. The homepage teases this; it doesn't have its own page yet.
- **Case Studies / Portfolio** — one level more substantial than a
  testimonial quote: a real project, the problem, the approach, the
  outcome. This is usually what actually closes a deal, more than
  testimonials do.
- **Pricing** — even a rough "starting at" / engagement-model page
  (fixed-scope vs. retainer vs. hourly) saves back-and-forth with
  unqualified leads.
- **Contact / Get a Quote** — a real intake form (project type, budget
  range, timeline), not just a mailto link. Ties into whichever CRM or
  inbox this should land in.
- **FAQ** — engagement process, typical timelines, tech stack
  preferences, how billing works. Reduces repetitive sales-call
  questions.
- **Process / How We Work** — a step-by-step of what happens after
  someone signs on (discovery → scoping → build → handoff, or
  whatever the real process is). Builds confidence the same way
  testimonials do, just structurally instead of socially.
- **Blog** — technically already exists (the platform itself), worth
  linking prominently from marketing pages as proof of expertise.
- **Careers** — even a single "not hiring right now, but here's how to
  get on our radar" page, if there's any intent to grow the team.
- **Custom 404 / 500 pages** — currently unknown whether these exist;
  worth confirming, since a broken-looking error page undercuts the
  reliability message the Testimonials page is trying to build.
- **Status page** — optional, but pairs well with the "reliability
  score" framing — a public uptime/incident history page (even a
  simple one) makes that claim verifiable instead of just stated.

## B. Legal pages

Everything below should go through an actual lawyer before publishing
— this is a checklist of what's typically needed, not legal advice or
drafted text.

- **Privacy Policy** — required by law in most jurisdictions once
  you're collecting emails/accounts (which this platform already
  does). Needs to cover what's actually collected: blogger accounts,
  OAuth data from Google/LinkedIn, cookies, analytics if any.
- **Terms of Service** — governs platform usage (posting rules,
  account termination/ban policy — ties into the admin ban feature
  already built — content ownership, liability limits).
- **Cookie Policy** — if the site sets any cookies beyond strictly
  necessary session cookies (NextAuth's JWT cookie counts), most
  jurisdictions want disclosure, sometimes a consent banner.
- **NDA (Mutual)** — a standard template for client engagements, used
  before any real project details are shared during a sales
  conversation.
- **MSA / Service Agreement template** — the actual contract structure
  for consulting engagements — scope, payment terms, IP assignment
  (who owns the code after delivery), termination clauses.
- **Refund / Cancellation Policy** — especially relevant if any
  retainer or upfront-payment model is used.
- **Acceptable Use Policy** — for the platform side specifically: what
  content isn't allowed, how moderation/bans (already built in the
  admin panel) are governed and communicated.
- **Copyright / DMCA Policy** — a takedown process for the blogging
  platform, since it hosts user-generated content.
- **Data Processing Agreement (DPA)** — needed if any client's data is
  processed as part of a consulting engagement, especially for
  EU/UK clients (GDPR) or California clients (CCPA).
- **Accessibility Statement** — pairs with the accessibility-audit item
  already in `FUTURE_WORK.md` — a public statement of intent/compliance
  level, common for both platforms and service companies.
- **Disclaimer** — general liability disclaimer for advice/consulting
  given, standard boilerplate but still needs sign-off.

---

## Notes

- Team and Testimonials pages are live (this session). Both use
  clearly-marked placeholder content — Team's co-founder entry and
  every testimonial name/quote/photo need replacing before this is
  public-facing.
- None of the legal documents above should be drafted from a template
  and shipped without a lawyer reviewing them for the actual
  jurisdiction(s) this operates in — flagging that explicitly since
  it's the one category here where a wrong guess has real consequences
  beyond a bug report.
