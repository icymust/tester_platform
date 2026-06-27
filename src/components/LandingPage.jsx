import {
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  ClipboardPenLine,
  CreditCard,
  FileText,
  LockKeyhole,
  Send,
  SearchCheck,
  ShieldCheck,
  Star,
  ArrowUp,
  UserRound,
  UsersRound,
  WalletCards,
  Zap,
} from "lucide-react";
import React from "react";
import { languages } from "../lib/i18n.js";

const processIcons = [ClipboardPenLine, UsersRound, SearchCheck, ClipboardCheck, WalletCards];
const benefitIcons = [
  { icon: ShieldCheck, tone: "purple" },
  { icon: FileText, tone: "green" },
  { icon: LockKeyhole, tone: "gold" },
  { icon: Zap, tone: "blue" },
];

export function LandingPage({
  language,
  onLanguageChange,
  onOpenRegister,
  onOpenSignIn,
  t,
}) {
  const processSteps = t.landing.how.steps.map(([title, text], index) => ({
    icon: processIcons[index],
    title,
    text,
  }));
  const benefits = t.landing.how.benefits.map(([title, text], index) => ({
    ...benefitIcons[index],
    title,
    text,
  }));

  return (
    <main className="landing-shell">
      <header className="landing-topbar">
        <div className="brand compact">
          <ShieldCheck size={34} />
          <span>{t.common.betaHub}</span>
        </div>

        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#how-it-works">{t.landing.nav.how}</a>
          <a href="#for-testers">{t.landing.nav.testers}</a>
          <a href="#for-clients">{t.landing.nav.clients}</a>
          <a href="#pricing">{t.landing.nav.pricing}</a>
        </nav>

        <div className="landing-topbar-actions">
          <LanguageSwitch language={language} onLanguageChange={onLanguageChange} />
          <button className="landing-link-button" onClick={onOpenSignIn} type="button">
            {t.common.login}
          </button>
          <button className="landing-primary-button" onClick={onOpenRegister} type="button">
            {t.common.getStarted}
          </button>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-copy">
          <span className="step-pill">{t.landing.hero.pill}</span>
          <h1>
            {t.landing.hero.titleA}
            <span>{t.landing.hero.titleB}</span>
          </h1>
          <p>{t.landing.hero.text}</p>

          <div className="landing-actions">
            <button className="landing-primary-button wide" onClick={() => onOpenRegister("client")} type="button">
              {t.landing.hero.clientCta} <UsersRound size={17} />
            </button>
            <button className="landing-secondary-button wide" onClick={() => onOpenRegister("tester")} type="button">
              {t.landing.hero.testerCta} <UserRound size={17} />
            </button>
          </div>

          <div className="landing-trust-row">
            <span><ShieldCheck size={17} /> {t.landing.hero.verified}</span>
            <span><ClipboardCheck size={17} /> {t.landing.hero.reports}</span>
            <span><BadgeCheck size={17} /> {t.landing.hero.payments}</span>
          </div>
        </div>

        <div className="landing-product">
          <div className="landing-dashboard">
            <aside className="landing-dashboard-rail">
              {Array.from({ length: 6 }).map((_, index) => (
                <span key={index}><UserRound size={15} /></span>
              ))}
            </aside>
            <div className="landing-dashboard-main">
              <h2>{t.landing.dashboard.myTasks}</h2>
              <div className="landing-stats-grid">
                <Stat value="12" label={t.landing.dashboard.activeTasks} />
                <Stat value="28" label={t.landing.dashboard.applications} />
                <Stat value="18" label={t.landing.dashboard.reports} />
                <Stat value="6" label={t.landing.dashboard.completed} />
              </div>
              <div className="landing-dashboard-content">
                <section className="landing-activity">
                  <h3>{t.landing.dashboard.recentActivity}</h3>
                  <Activity name={t.landing.dashboard.newApplication} detail={t.landing.dashboard.newApplicationDetail} time="2 min ago" />
                  <Activity name={t.landing.dashboard.reportSubmitted} detail={t.landing.dashboard.reportSubmittedDetail} time="15 min ago" />
                  <Activity name={t.landing.dashboard.taskCompleted} detail={t.landing.dashboard.taskCompletedDetail} time="1 h ago" done />
                  <Activity name={t.landing.dashboard.paymentSent} detail={t.landing.dashboard.paymentSentDetail} time="2 h ago" />
                </section>
                <section className="landing-report-card">
                  <h3>{t.landing.dashboard.reportsOverview}</h3>
                  <div className="landing-donut">
                    <strong>24</strong>
                    <span>{t.landing.dashboard.total}</span>
                  </div>
                  <div className="landing-report-legend">
                    <span className="approved">{t.landing.dashboard.approved}</span>
                    <span className="pending">{t.landing.dashboard.pending}</span>
                    <span className="changes">{t.landing.dashboard.changes}</span>
                  </div>
                  <h3>{t.landing.dashboard.topTesters}</h3>
                  <Tester name="alice.dev" score="4.9" reports="" />
                  <Tester name="dom2" score="4.8" reports=""/>
                  <Tester name="bob_the_tester" score="4.7" reports="" />
                </section>
              </div>
            </div>
          </div>
          <div className="landing-shield"><ShieldCheck size={70} /></div>
          <div className="landing-document"><FileText size={54} /><CheckCircle2 size={36} /></div>
        </div>
      </section>

      <section className="landing-split-section" id="for-testers">
        <div>
          <span className="landing-section-kicker">{t.landing.testers.kicker}</span>
          <h2>{t.landing.testers.title}</h2>
          <p>{t.landing.testers.text}</p>
          <button className="landing-secondary-button" onClick={() => onOpenRegister("tester")} type="button">
            {t.landing.testers.cta} <UserRound size={17} />
          </button>
        </div>
        <div className="landing-feature-card tester">
          <Star size={34} />
          <h3>{t.landing.testers.cardTitle}</h3>
          {t.landing.testers.features.map((feature) => (
            <span key={feature}><CheckCircle2 size={18} /> {feature}</span>
          ))}
        </div>
      </section>

      <section className="landing-split-section reverse" id="for-clients">
        <div>
          <span className="landing-section-kicker">{t.landing.clients.kicker}</span>
          <h2>{t.landing.clients.title}</h2>
          <p>{t.landing.clients.text}</p>
          <button className="landing-primary-button" onClick={() => onOpenRegister("client")} type="button">
            {t.landing.clients.cta} <UsersRound size={17} />
          </button>
        </div>
        <div className="landing-feature-card client">
          <Send size={34} />
          <h3>{t.landing.clients.cardTitle}</h3>
          {t.landing.clients.features.map((feature) => (
            <span key={feature}><CheckCircle2 size={18} /> {feature}</span>
          ))}
        </div>
      </section>

      <section className="landing-section" id="how-it-works">
        <h2>{t.landing.how.title}</h2>
        <p>{t.landing.how.subtitle}</p>
        <div className="landing-steps">
          {processSteps.map((step, index) => (
            <React.Fragment key={step.title}>
              <article className="landing-step">
                <span><step.icon size={30} /></span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
              {index < processSteps.length - 1 && <span className="landing-step-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="landing-benefits">
          {benefits.map((benefit) => (
            <article className="landing-benefit" key={benefit.title}>
              <span className={`landing-benefit-icon ${benefit.tone}`}>
                <benefit.icon size={34} />
              </span>
              <div>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-pricing" id="pricing">
        <div className="landing-pricing-copy">
          <span className="landing-section-kicker">{t.landing.pricing.kicker}</span>
          <h2>{t.landing.pricing.title}</h2>
          <p>{t.landing.pricing.text}</p>
        </div>
        <div className="landing-price-card">
          <CreditCard size={34} />
          <h3>{t.landing.pricing.cardTitle}</h3>
          <strong>{t.landing.pricing.price}</strong>
          <p>{t.landing.pricing.cardText}</p>
          <button className="landing-primary-button" onClick={onOpenRegister} type="button">
            {t.common.getStarted}
          </button>
        </div>
      </section>

      <button
        className="landing-scroll-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        type="button"
        aria-label={t.landing.scrollTop}
      >
        <ArrowUp size={24} />
      </button>
    </main>
  );
}

function LanguageSwitch({ language, onLanguageChange }) {
  return (
    <div className="language-switch" aria-label="Language">
      {Object.entries(languages).map(([key, meta]) => (
        <button
          className={language === key ? "active" : ""}
          key={key}
          onClick={() => onLanguageChange(key)}
          type="button"
        >
          {meta.short}
        </button>
      ))}
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="landing-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Activity({ name, detail, time, done = false }) {
  return (
    <div className="landing-activity-row">
      <span className={done ? "done" : ""}>{done ? <CheckCircle2 size={16} /> : <UserRound size={16} />}</span>
      <div>
        <small>{name}</small>
        <strong>{detail}</strong>
      </div>
      <time>{time}</time>
    </div>
  );
}

function Tester({ name, score, reports }) {
  return (
    <div className="landing-tester-row">
      <span>{name.slice(0, 1).toUpperCase()}</span>
      <strong>{name}</strong>
      <small>★ {score}</small>
      <em>{reports}</em>
    </div>
  );
}
