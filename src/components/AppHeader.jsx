import { LogOut, Settings, ShieldCheck } from "lucide-react";
import React from "react";
import { initials } from "../lib/platform.js";

export function AppHeader({
  currentUser,
  onLogout,
  onOpenProfile,
  onOpenSettings,
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
        title="Open profile"
      >
        <span className="avatar">{initials(currentUser.name)}</span>
        <div>
          <strong>{currentUser.name}</strong>
          <span>{currentUser.role === "tester" ? "Tester" : "Client"}</span>
        </div>
      </button>
      <div className="topbar-actions">
        <button
          className="icon-button"
          onClick={onOpenSettings}
          type="button"
          title="Account settings"
        >
          <Settings size={20} />
        </button>
        <button
          className="icon-button"
          onClick={onLogout}
          type="button"
          title="Log out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
