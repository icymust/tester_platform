import {
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  ClipboardPenLine,
  FileText,
  LockKeyhole,
  SearchCheck,
  ShieldCheck,
  UserRound,
  UsersRound,
  WalletCards,
  Zap,
} from "lucide-react";
import React from "react";

const processSteps = [
  {
    icon: ClipboardPenLine,
    title: "1. Post a task",
    text: "Describe your product, set the scope and budget.",
  },
  {
    icon: UsersRound,
    title: "2. Get testers",
    text: "Skilled testers apply to your task.",
  },
  {
    icon: SearchCheck,
    title: "3. Real testing",
    text: "Testers explore, find bugs, and submit reports.",
  },
  {
    icon: ClipboardCheck,
    title: "4. Review reports",
    text: "Review results, request changes if needed.",
  },
  {
    icon: WalletCards,
    title: "5. Pay & ship",
    text: "Approve, pay testers, and ship with confidence.",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "High-quality testers",
    text: "Work with verified testers who have proven experience and strong ratings.",
    tone: "purple",
  },
  {
    icon: FileText,
    title: "Structured reports",
    text: "Get clear, actionable reports with steps, screenshots, and suggested fixes.",
    tone: "green",
  },
  {
    icon: LockKeyhole,
    title: "Secure payments",
    text: "Escrow payments protect both you and testers. Pay only for approved work.",
    tone: "gold",
  },
  {
    icon: Zap,
    title: "Faster releases",
    text: "Find issues early, reduce risks, and release better products, faster.",
    tone: "blue",
  },
];

export function LandingPage({ onOpenAuth, onOpenRegister, onOpenSignIn }) {
  return (
    <main className="landing-shell">
      <header className="landing-topbar">
        <div className="brand compact">
          <ShieldCheck size={34} />
          <span>BetaHub</span>
        </div>

        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#for-testers">For testers</a>
          <a href="#for-clients">For clients</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
        </nav>

        <div className="landing-topbar-actions">
          <button className="landing-link-button" onClick={onOpenSignIn} type="button">
            Log in
          </button>
          <button className="landing-primary-button" onClick={onOpenRegister} type="button">
            Get started
          </button>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-copy">
          <span className="step-pill">QA marketplace for modern teams</span>
          <h1>
            Better testing.
            <span>Better products.</span>
          </h1>
          <p>
            BetaHub connects product teams with skilled testers. Post tasks, get
            real feedback, and ship with confidence.
          </p>

          <div className="landing-actions">
            <button className="landing-primary-button wide" onClick={onOpenRegister} type="button">
              I'm a client <UsersRound size={17} />
            </button>
            <button className="landing-secondary-button wide" onClick={onOpenAuth} type="button">
              I'm a tester <UserRound size={17} />
            </button>
          </div>

          <div className="landing-trust-row">
            <span><ShieldCheck size={17} /> Verified testers</span>
            <span><ClipboardCheck size={17} /> Structured reports</span>
            <span><BadgeCheck size={17} /> Secure payments</span>
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
              <h2>My tasks</h2>
              <div className="landing-stats-grid">
                <Stat value="12" label="Active tasks" />
                <Stat value="28" label="Applications" />
                <Stat value="18" label="Reports" />
                <Stat value="6" label="Completed" />
              </div>
              <div className="landing-dashboard-content">
                <section className="landing-activity">
                  <h3>Recent activity</h3>
                  <Activity name="New application" detail='alice.dev applied to "iOS App Testing"' time="2 min ago" />
                  <Activity name="Report submitted" detail="bob_the_tester submitted a report" time="15 min ago" />
                  <Activity name="Task completed" detail="Website Testing is completed" time="1 h ago" done />
                  <Activity name="Payment sent" detail="Payment sent to john.doe" time="2 h ago" />
                </section>
                <section className="landing-report-card">
                  <h3>Reports overview</h3>
                  <div className="landing-donut">
                    <strong>24</strong>
                    <span>Total</span>
                  </div>
                  <div className="landing-report-legend">
                    <span className="approved">12 Approved</span>
                    <span className="pending">8 Pending</span>
                    <span className="changes">4 Changes requested</span>
                  </div>
                  <h3>Top testers</h3>
                  <Tester name="alice.dev" score="4.9"/>
                  <Tester name="dom2" score="4.8" />
                  <Tester name="bob_the_tester" score="4.7"/>
                </section>
              </div>
            </div>
          </div>
          <div className="landing-shield"><ShieldCheck size={70} /></div>
          <div className="landing-document"><FileText size={54} /><CheckCircle2 size={36} /></div>
        </div>
      </section>

      <section className="landing-section" id="how-it-works">
        <h2>How it works</h2>
        <p>Simple process. Better results.</p>
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
      </section>

      <section className="landing-benefits" id="for-clients">
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
      </section>

      <section className="landing-quote" id="about">
        <span>“</span>
        <p>
          BetaHub helped us find critical issues before release. The reports
          were detailed and saved us weeks of work.
        </p>
        <div className="landing-avatar" aria-hidden="true">AR</div>
        <div>
          <strong>Alex R.</strong>
          <small>Product Manager</small>
        </div>
      </section>
    </main>
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
