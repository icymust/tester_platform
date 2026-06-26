import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import React from "react";
import { Metric } from "./common.jsx";

export function LandingPage({ onOpenAuth, onOpenRegister, onOpenSignIn }) {
  return (
    <main className="landing-shell">
      <header className="landing-topbar">
        <div className="brand compact">
          <ShieldCheck size={34} />
          <span>BetaHub</span>
        </div>

        <div className="landing-topbar-actions">
          <button className="secondary-button" onClick={onOpenSignIn} type="button">
            Sign in
          </button>
          <button className="primary-button" onClick={onOpenRegister} type="button">
            Register
          </button>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-copy">
          <span className="step-pill">QA marketplace for modern teams</span>
          <h1>Find testers, ship faster, and keep every bug report in one place.</h1>
          <p>
            BetaHub helps clients publish beta testing tasks, while testers can
            apply, report bugs, and track progress from a single dashboard.
          </p>

          <div className="landing-actions">
            <button className="primary-button" onClick={onOpenAuth} type="button">
              Get started <ArrowRight size={18} />
            </button>
            <button className="secondary-button" onClick={onOpenSignIn} type="button">
              I already have an account
            </button>
          </div>

          <div className="hero-metrics landing-metrics">
            <Metric value="2" label="roles" />
            <Metric value="1" label="workspace" />
            <Metric value="reports" label="tracked end to end" />
          </div>
        </div>

        <div className="landing-panel">
          <div className="landing-card spotlight-card">
            <Sparkles size={22} />
            <h2>Built for beta testing workflows</h2>
            <p>
              Clients post tasks, testers submit applications, and every report
              stays attached to the right task and user.
            </p>
          </div>

          <div className="landing-card-grid">
            <article className="landing-card">
              <UsersRound size={22} />
              <h3>Tester flow</h3>
              <p>Apply to tasks, start work, and submit structured bug reports.</p>
            </article>
            <article className="landing-card">
              <BarChart3 size={22} />
              <h3>Client view</h3>
              <p>See applicants, assign testers, and keep control of payments.</p>
            </article>
            <article className="landing-card wide">
              <CheckCircle2 size={22} />
              <h3>Reporting</h3>
              <p>
                Each report includes location, details, and a suggested fix so
                the feedback is easy to review.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
