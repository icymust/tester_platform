# BetaHub

BetaHub is a two-sided QA marketplace prototype that connects product teams with independent testers. Clients publish structured testing tasks, testers apply and submit reports, and the platform keeps task status, applications, reports, payments, profiles, and messages in one workflow.

## Challenge

**Chosen challenge:** workforce access and digital business support through practical software testing.

**Specific problem:** this is a two-sided access problem.

For companies, software testing is necessary but expensive. A full QA team or even a single full-time QA hire can be a major fixed cost. For small companies, early-stage startups, SMEs, and agencies, that cost can be completely unrealistic when the need is temporary: an MVP launch, a checkout-flow check, a campaign landing page, a booking form, a dashboard update, or a mobile usability review. Traditional freelancers can help, but the company still has to manage selection, briefing, validation, payment, and report quality.

This problem is becoming more urgent because of the growing trend of vibe-coding and AI-assisted product building. These tools let founders and small teams create prototypes, landing pages, dashboards, and application flows much faster than before. That speed is useful, but it also increases risk: code can be generated without full understanding of edge cases, authentication logic, form validation, error handling, data exposure, accessibility, mobile behavior, or payment-flow failure states. A product can look complete while still containing functional defects, weak user journeys, or security-sensitive mistakes. Faster building therefore increases the need for independent testing before real users interact with the system.

For testers, especially recently graduated students, junior QA testers, self-taught testers, career-switchers, freelancers, and people from non-traditional backgrounds, the problem is the opposite: they may have the motivation and basic ability to test software, but they lack real projects, client history, accepted reports, ratings, and portfolio evidence. Without that first proof of work, finding paid testing opportunities is difficult.

BetaHub addresses both sides at once: businesses need affordable structured testing, and independent testers need a controlled route into real QA work.

BetaHub is positioned first as a UAE-focused platform. The goal is to serve the local digital community with a more regional, trusted, and context-aware alternative to large international freelance marketplaces. UAE businesses should not have to rely only on broad global platforms where quality, communication, timezone fit, regional understanding, and accountability can be inconsistent. A local QA marketplace can build trust around UAE business needs, local product flows, Arabic and English users, regional payment expectations, and practical community relationships.

## Target Demographic

BetaHub is built for:

**Businesses**

- startup founders and product managers preparing beta releases;
- SMEs and service businesses that need websites, booking flows, payment journeys, customer portals, and dashboards checked before launch;
- e-commerce teams validating checkout and customer journeys;
- digital agencies needing external validation before client delivery;
- small software teams without dedicated QA staff;
- early-stage platforms that need external feedback before launch.

**Independent testers and freelancers**

- junior QA testers;
- recently graduated students;
- self-taught testers;
- students with basic digital or testing skills;
- freelancers building their first client history;
- career-switchers entering digital work;
- people from non-traditional backgrounds;
- experienced testers seeking additional freelance tasks;
- users who need a lower-barrier entry point into paid QA work.

The target situation is practical: a client has a product, a limited budget, and a deadline. They need several testers, clear reports, controlled payment flow, and a way to review tester history before selecting someone.

The UAE is a strong initial validation market because non-oil business activity, e-commerce, digital services, finance, tourism, logistics, and AI-driven transformation are increasing the number of companies that depend on customer-facing digital flows. As more businesses operate through software, the need for affordable functional testing, usability review, mobile-flow testing, and pre-launch validation becomes immediate.

For the local community, the demographic is not only "companies and testers" in general. It is UAE startups, SMEs, agencies, students, junior developers, junior QA testers, and self-taught digital workers who need more practical opportunities inside their own market. BetaHub gives local talent a way to gain experience on real regional products while giving businesses a more familiar and accountable testing channel.

## Solution

BetaHub provides a working prototype of the core marketplace flow:

- clients create testing tasks with product type, scope, budget, tester slots, deadline, and private work link;
- testers browse available tasks and apply with a short message;
- clients review all applications across their own tasks and open tester profiles;
- clients select testers for a task;
- selected testers access a testing workspace and submit structured bug reports;
- reports include title, location, vulnerability or bug details, and suggested fix;
- task details show applications, selected testers, reports, and payment state;
- users can send simple persisted messages to each other;
- profiles, settings, payments, and application history are available inside the platform;
- the public landing and platform support English and Arabic, including right-to-left layout.

The long-term service model is tiered:

- **Starter Campaign:** low-risk testing for MVPs, landing pages, small websites, broken links, layout issues, mobile responsiveness, forms, and basic usability.
- **Growth Campaign:** broader coverage for SMEs, e-commerce flows, booking systems, SaaS onboarding, and mixed tester pools.
- **Launch Campaign:** stronger validation for higher-risk launches, agencies, funded startups, and products that need more experienced testers.

This tiering lets small companies access testing without full-time hiring while giving junior testers a safe entry point and experienced testers a path to higher-value work.

BetaHub is a win-win platform:

- companies receive flexible, affordable, structured testing without long-term hiring commitments;
- testers receive access to real tasks, paid opportunities, feedback, accepted reports, and portfolio evidence;
- the platform creates the quality-control layer between both sides through structured reports, validation, moderation, reputation, and payout logic.
- the UAE community keeps more value inside the local ecosystem instead of sending every small testing need to large international platforms.

## Impact

BetaHub creates impact because it converts independent testing capacity into structured freelance service delivery.

For businesses, the platform provides:

- lower-cost testing options compared with fixed QA hiring for short-term needs;
- flexible campaign-based QA support;
- a regional and more trusted alternative to large international freelance platforms;
- testers who can better understand local user expectations, bilingual Arabic/English flows, UAE service patterns, and regional product context;
- structured bug reports instead of informal feedback;
- multiple testers instead of one reviewer;
- broader device, browser, and user-flow coverage;
- reduced launch risk for websites, apps, checkout flows, booking systems, dashboards, and customer portals;
- a practical safety layer for AI-assisted or vibe-coded products that may have been built quickly without enough manual validation;
- no long-term hiring commitment.

For independent testers, the platform provides:

- access to real testing tasks;
- potential paid work;
- client-style reporting experience;
- portfolio evidence through accepted reports;
- a path into freelance QA regardless of formal background;
- progression from junior campaigns to higher-value work;
- reputation signals that can support future employability.
- more practical experience for local students, junior testers, junior developers, and self-taught digital workers inside the UAE ecosystem.

For the wider ecosystem, BetaHub supports digital quality, freelance access, workforce participation, and practical skills development. It is not an online course and not only a training tool. It is a service marketplace where companies pay for testing output and testers gain experience by delivering real work. The regional value is important: a UAE-focused platform can help local developers and testers build stronger proof of work while helping local businesses access trusted QA support without leaving the regional ecosystem.

The prototype makes this workflow measurable and easier to validate.

Testable claims in the current build:

- A client can create a task and define the exact number of tester places.
- A tester can apply to a task and the application appears in the client dashboard.
- A client can view all testers who applied to their tasks from the Applications section.
- A client can open a tester profile from an application.
- A client can select testers and the task state updates based on filled slots.
- A selected tester can open a workspace and submit a structured report.
- Submitted reports remain available after page refresh through local persistence.
- Messages between two users store sender ID, receiver ID, content, and timestamp.
- The interface can switch between English and Arabic with RTL layout.

These claims can be verified manually without external services.

Testable claims for pilot validation after the hackathon:

- At least 60% of pilot companies should rate structured reports as useful or actionable.
- Junior testers should produce acceptable output when given lower-risk tasks and structured templates.
- Multi-tester campaigns should find a broader set of unique issues than a single-tester review.
- Short-term testing campaigns should cost materially less than a one-month full-time QA hiring assumption.
- Tester profiles should accumulate accepted reports, rating history, and portfolio evidence.
- Platform fees should be measured against moderation, infrastructure, validation, and payment-processing costs.

The economic hypothesis is concrete: a company facing a short-term QA need may compare a one-month QA hiring cost assumption of about AED 12,000 with a BetaHub Growth Campaign model around AED 3,000. That implies a potential short-term cost reduction of about 75%, subject to market validation.

## Feasibility

This prototype is intentionally lightweight. It demonstrates the product logic without requiring backend infrastructure during the hackathon.

Current implementation:

- React frontend built with Vite;
- local persistence through `localStorage`;
- role-based client/tester flows in the UI;
- structured task, application, report, message, profile, and payment data models;
- bilingual UI through an internal translation file;
- responsive CSS split by platform area.

Production path after the event:

- replace `localStorage` with PostgreSQL for users, campaigns, applications, reports, payouts, reputation, and messages;
- add API routes using Node.js, Express, NestJS, or another lightweight backend;
- add authentication, sessions, and role-based access control;
- store screenshots and report attachments in object storage;
- add admin moderation for users, reports, disputes, abuse prevention, and report validation;
- add payment processing, manual payout approval, platform service fees, and payout tracking;
- add notifications or WebSocket updates only after the core workflow is stable.

The architecture can scale because the prototype already separates the main entities: users, tasks, applications, reports, messages, and payments.

Key implementation risks are known: fake or low-quality reports, spam, unclear testing scopes, payment disputes, privacy issues, and moderation workload. The mitigation plan is structured report validation, evidence requirements, account reputation, report limits, admin review, clear campaign scope, and manual payout approval before automation.

## Deployment

The project can be deployed as a static Vite build.

Recommended low-cost deployment options:

- Vercel;
- Netlify;
- Cloudflare Pages;
- static hosting behind a VPS or object storage bucket.

For a production version, the frontend can remain static while the API, database, file storage, and payment provider run as separate services.

Scalability beyond the event comes from the marketplace structure. Companies create demand through testing campaigns. Testers build reputation through accepted reports. Campaign tiers allow the platform to expand across risk levels, budgets, tester experience, and regions. The first strategic market is the UAE, where local trust, bilingual workflows, community relationships, and business context can become a competitive advantage. After validation, the same regional marketplace model can expand to nearby markets. Partnerships with UAE startup accelerators, SME organisations, universities, bootcamps, digital agencies, freelancer communities, and technology groups can increase both sides of the market.

## How To Run

Requirements:

- Node.js 18 or newer;
- npm.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173/
```

Build for production:

```bash
npm run build
```

## How To Verify

Manual verification flow:

1. Open the landing page.
2. Create a client account.
3. Create a testing task from the client dashboard.
4. Log out and create a tester account.
5. Complete the tester profile.
6. Apply to the client task.
7. Log back in as the client.
8. Open Applications and confirm the tester appears.
9. Open the tester profile from the application row.
10. Send a message from the profile.
11. Open Messages and confirm the conversation exists.
12. Select the tester for the task.
13. Log in as the tester and start the assigned task.
14. Submit a bug report.
15. Refresh the page and confirm the data remains.

Build verification used:

```bash
npm run build
```

## Tools Used

- React
- Vite
- JavaScript
- CSS
- lucide-react icons
- Browser `localStorage`

## Evidence And Validation

The prototype validates the core product loop:

- client onboarding;
- tester onboarding;
- task creation;
- tester application;
- profile review;
- tester selection;
- structured report submission;
- simple payment state tracking;
- persisted messaging;
- bilingual English/Arabic interface.

The current validation is functional, not statistical: the app proves that the proposed marketplace workflow can be implemented, run locally, and tested end to end within the hackathon scope.

The post-hackathon evidence plan is:

- run MVP walkthroughs with target companies and testers;
- interview startups, SMEs, agencies, and freelance testers;
- test onboarding quality with junior testers;
- run a pilot campaign against a sample website or app;
- track accepted and rejected reports;
- measure company ratings of report usefulness;
- compare multi-tester coverage against single-reviewer coverage;
- track moderation time and operational cost;
- compare campaign pricing against hiring and freelancer alternatives;
- document findings in the repository.

This makes the project falsifiable. If companies do not find reports useful, if junior testers cannot produce acceptable output, or if moderation cost is too high, the team can measure that and adjust the model.

## Limitations

The prototype does not yet include:

- real backend authentication;
- server-side database;
- file uploads for screenshots;
- online chat or push notifications;
- real payment processing;
- admin moderation dashboard.

These are planned production steps, not blockers for validating the core workflow.
