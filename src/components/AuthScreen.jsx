import {
  BriefcaseBusiness,
  Check,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import React from "react";
import { Metric } from "./common.jsx";

export function AuthScreen({
  authError,
  authForm,
  authMode,
  onAuth,
  onAuthErrorClear,
  onAuthFormChange,
  onAuthModeChange,
  onRoleChange,
  role,
}) {
  return (
    <main className="auth-shell">
      <section className="hero">
        <div className="brand">
          <ShieldCheck size={34} />
          <span>BetaHub</span>
        </div>
        <h1>IT beta testing platform</h1>
        <p>
          Clients publish testing tasks, QA testers apply, and the client chooses
          the best candidate from the dashboard.
        </p>
        <div className="hero-metrics">
          <Metric value="2" label="roles" />
          <Metric value="5 min" label="to first application" />
          <Metric value="MVP" label="hackathon ready" />
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-tabs">
          <button
            className={authMode === "login" ? "active" : ""}
            onClick={() => {
              onAuthModeChange("login");
              onAuthErrorClear();
            }}
            type="button"
          >
            Sign in
          </button>
          <button
            className={authMode === "register" ? "active" : ""}
            onClick={() => {
              onAuthModeChange("register");
              onAuthErrorClear();
            }}
            type="button"
          >
            Register
          </button>
        </div>

        <form onSubmit={onAuth} className="form">
          {authMode === "register" && (
            <>
              <div className="role-picker">
                <span>Register as</span>
                <div className="segmented">
                  <button
                    className={role === "tester" ? "active" : ""}
                    onClick={() => onRoleChange("tester")}
                    type="button"
                  >
                    <UserRound size={18} /> Tester
                  </button>
                  <button
                    className={role === "client" ? "active" : ""}
                    onClick={() => onRoleChange("client")}
                    type="button"
                  >
                    <BriefcaseBusiness size={18} /> Client
                  </button>
                </div>
              </div>
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
            </>
          )}
          <label>
            Username
            <input
              value={authForm.login}
              onChange={(event) => {
                onAuthFormChange({ ...authForm, login: event.target.value });
                onAuthErrorClear();
              }}
              placeholder="username"
            />
          </label>
          <label>
            Password
            <input
              value={authForm.password}
              onChange={(event) => {
                onAuthFormChange({ ...authForm, password: event.target.value });
                onAuthErrorClear();
              }}
              placeholder="********"
              type="password"
            />
          </label>
          <button className="primary-button" type="submit">
            <Check size={18} />
            {authMode === "login" ? "Sign in" : "Create account"}
          </button>
          <p className={`form-error ${authError ? "visible" : ""}`}>
            {authError || " "}
          </p>
        </form>
      </section>
    </main>
  );
}
