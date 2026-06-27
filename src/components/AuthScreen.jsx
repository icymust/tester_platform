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
import { languages } from "../lib/i18n.js";

export function AuthScreen({
  authError,
  authForm,
  authMode,
  onAuth,
  onAuthErrorClear,
  onAuthFormChange,
  onAuthModeChange,
  onGoHome,
  onLanguageChange,
  onRoleChange,
  language,
  role,
  t,
}) {
  const isLogin = authMode === "login";

  return (
    <main className="auth-shell">
      <div className="auth-language-wrap">
        <LanguageSwitch language={language} onLanguageChange={onLanguageChange} />
      </div>
      <button className="auth-close-button" onClick={onGoHome} type="button" aria-label={t.auth.back}>
        <X size={24} />
      </button>
      <section className="auth-hero-panel">
        <button className="auth-brand" onClick={onGoHome} type="button">
          <ShieldCheck size={34} />
          <span>{t.common.betaHub}</span>
        </button>

        <div className="auth-hero-content">
          <div className="auth-hero-copy">
            <h1>
              {t.auth.headlineA}
              <span>{t.auth.headlineB}</span>
              <strong>{t.auth.headlineC}</strong>
            </h1>
            <p>{t.auth.intro}</p>
          </div>

          <div className="auth-illustration" aria-hidden="true">
            <div className="auth-orbit" />
            <div className="auth-floating-card chart">
              <BarChart3 size={54} />
            </div>
            <div className="auth-floating-card report">
              <span />
              <h3>{t.auth.reportCard}</h3>
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
            <span><MessageSquareText size={30} /> {t.auth.realFeedback}</span>
            <span><Clock3 size={30} /> {t.auth.fastResults}</span>
            <span><BadgeCheck size={30} /> {t.auth.qualityAssured}</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className={`auth-card ${isLogin ? "login-mode" : "register-mode"}`}>
          <div className="auth-card-header">
            <h2>{isLogin ? t.auth.welcome : t.auth.create}</h2>
            <p>{isLogin ? t.auth.signInPrompt : t.auth.signUpPrompt}</p>
          </div>

          {!isLogin && (
            <div className="auth-role-switch">
              <button
                className={role === "client" ? "active" : ""}
                onClick={() => onRoleChange("client")}
                type="button"
              >
                <Building2 size={21} /> {t.common.client}
              </button>
              <button
                className={role === "tester" ? "active" : ""}
                onClick={() => onRoleChange("tester")}
                type="button"
              >
                <UserRound size={21} /> {t.common.tester}
              </button>
            </div>
          )}

          <form onSubmit={onAuth} className="auth-form">
            {!isLogin && (
              <label>
                {t.auth.name}
                <input
                  value={authForm.name}
                  onChange={(event) => {
                    onAuthFormChange({ ...authForm, name: event.target.value });
                    onAuthErrorClear();
                  }}
                  placeholder={t.auth.namePlaceholder}
                />
              </label>
            )}

            <label>
              {t.common.email}
              <span className="auth-input-wrap">
                <input
                  value={authForm.login}
                  onChange={(event) => {
                    onAuthFormChange({ ...authForm, login: event.target.value });
                    onAuthErrorClear();
                  }}
                  placeholder={t.auth.emailPlaceholder}
                />
                <Mail size={18} />
              </span>
            </label>
            <label>
              {t.common.password}
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
              {isLogin ? t.auth.signIn : t.auth.create}
              {!isLogin && <Check size={18} />}
            </button>
            <p className={`form-error ${authError ? "visible" : ""}`}>
              {authError || " "}
            </p>
          </form>

          <div className="auth-mode-footer">
            <span>{isLogin ? t.auth.newTo : t.auth.already}</span>
            <button
              onClick={() => {
                onAuthModeChange(isLogin ? "register" : "login");
                onRoleChange("");
                onAuthErrorClear();
              }}
              type="button"
            >
              {isLogin ? t.auth.signUp : t.auth.signIn}
            </button>
          </div>
        </div>
      </section>
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
