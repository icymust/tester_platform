import { Check, X } from "lucide-react";
import React from "react";

export function AccountSettingsModal({
  currentUser,
  onClose,
  onFormChange,
  onSave,
  settingsForm,
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="settings-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <span className="step-pill">Account settings</span>
            <h2>Edit account</h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button" title="Close">
            <X size={20} />
          </button>
        </div>

        <form className="form settings-form" onSubmit={onSave}>
          <div className="form-grid">
            <label>
              Name
              <input
                value={settingsForm.name}
                onChange={(event) =>
                  onFormChange({ ...settingsForm, name: event.target.value })
                }
                placeholder="Your name or company"
              />
            </label>
            <label>
              Username
              <input
                value={settingsForm.login}
                onChange={(event) =>
                  onFormChange({ ...settingsForm, login: event.target.value })
                }
                placeholder="username"
              />
            </label>
          </div>

          <label>
            Password
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
                Experience
                <textarea
                  value={settingsForm.experience}
                  onChange={(event) =>
                    onFormChange({
                      ...settingsForm,
                      experience: event.target.value,
                    })
                  }
                  placeholder="For example, 2 years of manual testing"
                />
              </label>
              <label>
                Skills
                <textarea
                  value={settingsForm.skills}
                  onChange={(event) =>
                    onFormChange({ ...settingsForm, skills: event.target.value })
                  }
                  placeholder="Web, mobile, API, SQL"
                />
              </label>
              <label>
                Education / Training
                <textarea
                  value={settingsForm.education}
                  onChange={(event) =>
                    onFormChange({
                      ...settingsForm,
                      education: event.target.value,
                    })
                  }
                  placeholder="QA courses, bootcamps, university, self-study"
                />
              </label>
              <label>
                Certificates
                <input
                  value={settingsForm.certificates}
                  onChange={(event) =>
                    onFormChange({
                      ...settingsForm,
                      certificates: event.target.value,
                    })
                  }
                  placeholder="ISTQB, courses, degree"
                />
              </label>
            </>
          )}

          <div className="modal-actions">
            <button className="secondary-button" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="primary-button" type="submit">
              <Check size={18} /> Save changes
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
