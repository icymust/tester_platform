import { Check, LogOut, ShieldCheck } from "lucide-react";
import React from "react";

export function OnboardingProfile({
  currentUser,
  onLogout,
  onProfileChange,
  onUpdateProfile,
  profileForm,
}) {
  return (
    <main className="onboarding-shell">
      <section className="onboarding-panel">
        <div className="onboarding-header">
          <div className="brand compact">
            <ShieldCheck size={28} />
            <span>BetaHub</span>
          </div>
          <button className="icon-button" onClick={onLogout} type="button" title="Log out">
            <LogOut size={20} />
          </button>
        </div>

        <div className="onboarding-copy">
          <span className="step-pill">Tester profile</span>
          <h1>Complete your QA profile</h1>
          <p>
            Add your testing background before entering the platform. Clients will
            use this information when choosing an executor.
          </p>
        </div>

        <form className="form onboarding-form" onSubmit={onUpdateProfile}>
          <label>
            Experience
            <textarea
              value={profileForm.experience}
              onChange={(event) =>
                onProfileChange({ ...profileForm, experience: event.target.value })
              }
              placeholder="For example, 2 years of manual testing"
            />
          </label>
          <label>
            Skills
            <textarea
              value={profileForm.skills}
              onChange={(event) =>
                onProfileChange({ ...profileForm, skills: event.target.value })
              }
              placeholder="Web, mobile, API, SQL"
            />
          </label>
          <label>
            Education / Training
            <textarea
              value={profileForm.education}
              onChange={(event) =>
                onProfileChange({ ...profileForm, education: event.target.value })
              }
              placeholder="QA courses, bootcamps, university, self-study"
            />
          </label>
          <label>
            Certificates
            <input
              value={profileForm.certificates}
              onChange={(event) =>
                onProfileChange({
                  ...profileForm,
                  certificates: event.target.value,
                })
              }
              placeholder="ISTQB, courses, degree"
            />
          </label>
          <button className="primary-button" type="submit">
            <Check size={18} /> Continue to platform
          </button>
        </form>
      </section>
    </main>
  );
}
