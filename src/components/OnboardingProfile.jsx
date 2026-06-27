import { Check, LogOut, ShieldCheck } from "lucide-react";
import React from "react";

export function OnboardingProfile({
  currentUser,
  onLogout,
  onProfileChange,
  onUpdateProfile,
  profileForm,
  t,
}) {
  const p = t.platform.onboarding;
  return (
    <main className="onboarding-shell">
      <section className="onboarding-panel">
        <div className="onboarding-header">
          <div className="brand compact">
            <ShieldCheck size={28} />
            <span>BetaHub</span>
          </div>
          <button className="icon-button" onClick={onLogout} type="button" title={t.common.logout}>
            <LogOut size={20} />
          </button>
        </div>

        <div className="onboarding-copy">
          <span className="step-pill">{p.pill}</span>
          <h1>{p.title}</h1>
          <p>{p.text}</p>
        </div>

        <form className="form onboarding-form" onSubmit={onUpdateProfile}>
          <label>
            {p.experience}
            <textarea
              value={profileForm.experience}
              onChange={(event) =>
                onProfileChange({ ...profileForm, experience: event.target.value })
              }
              placeholder={p.experiencePlaceholder}
            />
          </label>
          <label>
            {p.skills}
            <textarea
              value={profileForm.skills}
              onChange={(event) =>
                onProfileChange({ ...profileForm, skills: event.target.value })
              }
              placeholder={p.skillsPlaceholder}
            />
          </label>
          <label>
            {p.education}
            <textarea
              value={profileForm.education}
              onChange={(event) =>
                onProfileChange({ ...profileForm, education: event.target.value })
              }
              placeholder={p.educationPlaceholder}
            />
          </label>
          <label>
            {p.certificates}
            <input
              value={profileForm.certificates}
              onChange={(event) =>
                onProfileChange({
                  ...profileForm,
                  certificates: event.target.value,
                })
              }
              placeholder={p.certificatesPlaceholder}
            />
          </label>
          <button className="primary-button" type="submit">
            <Check size={18} /> {p.continue}
          </button>
        </form>
      </section>
    </main>
  );
}
