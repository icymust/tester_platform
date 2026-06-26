import {
  BadgeCheck,
  BarChart3,
  Check,
  Building2,
  Clock3,
  EyeOff,
  FlaskConical,
  Mail,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import React from "react";

export function AuthScreen({
  authError,
  authForm,
  authMode,
  onAuth,
  onAuthErrorClear,
  onAuthFormChange,
  onAuthModeChange,
  onGoHome,
  onRoleChange,
  role,
}) {
  const isLogin = authMode === "login";

  return (
    <main className="auth-shell">
      <button className="auth-close-button" onClick={onGoHome} type="button" aria-label="Back to landing page">
        <X size={24} />
      </button>
      <section className="auth-hero-panel">
        <button className="auth-brand" onClick={onGoHome} type="button">
          <ShieldCheck size={34} />
          <span>BetaHub</span>
        </button>

        <div className="auth-hero-content">
          <div className="auth-hero-copy">
            <h1>
              Test.
              <span>Report.</span>
              <strong>Ship better.</strong>
            </h1>
            <p>The QA marketplace that connects product teams with top testers worldwide.</p>
          </div>

          <div className="auth-illustration" aria-hidden="true">
            <div className="auth-orbit" />
            <div className="auth-floating-card chart">
              <BarChart3 size={54} />
            </div>
            <div className="auth-floating-card report">
              <span />
              <h3>Bug report</h3>
              <p />
              <p />
              <p />
            </div>
            <div className="auth-floating-badge">
              <ShieldCheck size={38} />
            </div>
            <div className="auth-floating-message">
              <span />
              <p />
              <p />
            </div>
            <div className="auth-map">
              <MapPin className="pin pin-one" size={34} />
              <MapPin className="pin pin-two" size={28} />
              <MapPin className="pin pin-three" size={30} />
              <MapPin className="pin pin-four" size={24} />
            </div>
          </div>

          <div className="auth-benefits">
            <span><MessageSquareText size={30} /> Real feedback</span>
            <span><Clock3 size={30} /> Fast results</span>
            <span><BadgeCheck size={30} /> Quality assured</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className={`auth-card ${isLogin ? "login-mode" : "register-mode"}`}>
          <div className="auth-card-header">
            <h2>{isLogin ? "Welcome back" : "Create account"}</h2>
            <p>{isLogin ? "Please sign in to your account" : "Join BetaHub and start testing smarter"}</p>
          </div>

          {!isLogin && (
            <div className="auth-role-switch">
              <button
                className={role === "client" ? "active" : ""}
                onClick={() => onRoleChange("client")}
                type="button"
              >
                <Building2 size={21} /> Client
              </button>
              <button
                className={role === "tester" ? "active" : ""}
                onClick={() => onRoleChange("tester")}
                type="button"
              >
                <UserRound size={21} /> Tester
              </button>
            </div>
          )}

          <form onSubmit={onAuth} className="auth-form">
            {!isLogin && (
              <label>
                Name or company
                <input
                  value={authForm.name}
                  onChange={(event) => {
                    onAuthFormChange({ ...authForm, name: event.target.value });
                    onAuthErrorClear();
                  }}
                  placeholder="For example, Pixel QA"
                />
              </label>
            )}

            <label>
              Email
              <span className="auth-input-wrap">
                <input
                  value={authForm.login}
                  onChange={(event) => {
                    onAuthFormChange({ ...authForm, login: event.target.value });
                    onAuthErrorClear();
                  }}
                  placeholder="you@example.com"
                />
                <Mail size={18} />
              </span>
            </label>
            <label>
              Password
              <span className="auth-input-wrap">
                <input
                  value={authForm.password}
                  onChange={(event) => {
                    onAuthFormChange({ ...authForm, password: event.target.value });
                    onAuthErrorClear();
                  }}
                  placeholder="**********"
                  type="password"
                />
                <EyeOff size={19} />
              </span>
            </label>
            <button className="auth-submit" type="submit">
              {isLogin ? "Sign in" : "Create account"}
              {!isLogin && <Check size={18} />}
            </button>
            <p className={`form-error ${authError ? "visible" : ""}`}>
              {authError || " "}
            </p>
          </form>

          <div className="auth-mode-footer">
            <span>{isLogin ? "New to BetaHub?" : "Already have an account?"}</span>
            <button
              onClick={() => {
                onAuthModeChange(isLogin ? "register" : "login");
                onRoleChange("");
                onAuthErrorClear();
              }}
              type="button"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
