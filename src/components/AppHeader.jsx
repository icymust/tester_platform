import { LogOut, ShieldCheck } from "lucide-react";
import React from "react";
import { languages } from "../lib/i18n.js";
import { initials } from "../lib/platform.js";

export function AppHeader({
  currentUser,
  language,
  onLogout,
  onLanguageChange,
  onOpenProfile,
  t,
}) {
  return (
    <header className="topbar">
      <div className="brand compact">
        <ShieldCheck size={28} />
        <span>BetaHub</span>
      </div>
      <button
        className="user-chip"
        onClick={() => onOpenProfile(currentUser.id)}
        type="button"
        title={t.common.openProfile}
      >
        <span className="avatar">{initials(currentUser.name)}</span>
        <div>
          <strong>{currentUser.name}</strong>
          <span>{currentUser.role === "tester" ? t.common.tester : t.common.client}</span>
        </div>
      </button>
      <div className="topbar-actions">
        <LanguageSwitch language={language} onLanguageChange={onLanguageChange} t={t} />
        <button
          className="icon-button"
          onClick={onLogout}
          type="button"
          title={t.common.logout}
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

function LanguageSwitch({ language, onLanguageChange, t }) {
  return (
    <div className="language-switch" aria-label={t.common.language}>
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
