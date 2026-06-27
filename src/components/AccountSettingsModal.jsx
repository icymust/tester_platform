import { Check, X } from "lucide-react";
import React from "react";

export function AccountSettingsModal({
  currentUser,
  onClose,
  onFormChange,
  onSave,
  settingsForm,
  t,
}) {
  const p = t.platform;
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="settings-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <span className="step-pill">{p.settings.pill}</span>
            <h2>{p.settings.title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button" title={p.settings.close}>
            <X size={20} />
          </button>
        </div>

        <form className="form settings-form" onSubmit={onSave}>
          <div className="form-grid">
            <label>
              {p.settings.name}
              <input
                value={settingsForm.name}
                onChange={(event) =>
                  onFormChange({ ...settingsForm, name: event.target.value })
                }
                placeholder={p.settings.namePlaceholder}
              />
            </label>
            <label>
              {p.settings.username}
              <input
                value={settingsForm.login}
                onChange={(event) =>
                  onFormChange({ ...settingsForm, login: event.target.value })
                }
                placeholder={p.settings.usernamePlaceholder}
              />
            </label>
          </div>

          <label>
            {p.settings.password}
            <input
              value={settingsForm.password}
              onChange={(event) =>
                onFormChange({ ...settingsForm, password: event.target.value })
              }
              placeholder="********"
              type="password"
            />
          </label>

          {currentUser.role === "tester" && (
            <>
              <label>
                {p.onboarding.experience}
                <textarea
                  value={settingsForm.experience}
                  onChange={(event) =>
                    onFormChange({
                      ...settingsForm,
                      experience: event.target.value,
                    })
                  }
                  placeholder={p.onboarding.experiencePlaceholder}
                />
              </label>
              <label>
                {p.onboarding.skills}
                <textarea
                  value={settingsForm.skills}
                  onChange={(event) =>
                    onFormChange({ ...settingsForm, skills: event.target.value })
                  }
                  placeholder={p.onboarding.skillsPlaceholder}
                />
              </label>
              <label>
                {p.onboarding.education}
                <textarea
                  value={settingsForm.education}
                  onChange={(event) =>
                    onFormChange({
                      ...settingsForm,
                      education: event.target.value,
                    })
                  }
                  placeholder={p.onboarding.educationPlaceholder}
                />
              </label>
              <label>
                {p.onboarding.certificates}
                <input
                  value={settingsForm.certificates}
                  onChange={(event) =>
                    onFormChange({
                      ...settingsForm,
                      certificates: event.target.value,
                    })
                  }
                  placeholder={p.onboarding.certificatesPlaceholder}
                />
              </label>
            </>
          )}

          <div className="modal-actions">
            <button className="secondary-button" onClick={onClose} type="button">
              {p.settings.cancel}
            </button>
            <button className="primary-button" type="submit">
              <Check size={18} /> {p.settings.save}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
