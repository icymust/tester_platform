import { Bug, ExternalLink, Send, X } from "lucide-react";
import React from "react";
import { DetailBlock } from "./common.jsx";
import { formatDeadline, money, taskPayout } from "../lib/platform.js";

export function TesterWorkspaceModal({
  currentUser,
  onClose,
  onFormChange,
  onReportToggle,
  onSubmitReport,
  reportForm,
  reportFormOpen,
  t,
  task,
}) {
  const p = t.platform.workspace;
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="settings-modal workspace-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <span className="step-pill">{p.pill}</span>
            <h2>{task.title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button" title={t.platform.settings.close}>
            <X size={20} />
          </button>
        </div>

        <div className="task-detail-grid">
          <DetailBlock label={p.product} value={task.product} />
          <DetailBlock label={p.payout} value={money(taskPayout(task))} />
          <DetailBlock label={p.deadline} value={formatDeadline(task.deadline)} />
          <DetailBlock label={p.tester} value={currentUser.name} />
        </div>

        <div className="detail-section">
          <h3>{p.target}</h3>
          {task.privateLink ? (
            <a
              className="work-link"
              href={task.privateLink}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink size={17} /> {task.privateLink}
            </a>
          ) : (
            <p>{p.noLink}</p>
          )}
        </div>

        <div className="detail-section">
          <h3>{p.requirements}</h3>
          <p>{task.expected || p.noRequirements}</p>
        </div>

        <div className="workspace-actions">
          <button className="danger-button" onClick={onReportToggle} type="button">
            <Bug size={18} /> {p.reportIssue}
          </button>
        </div>

        {reportFormOpen && (
          <form className="form report-form" onSubmit={onSubmitReport}>
            <label>
              {p.reportTitle}
              <input
                value={reportForm.title}
                onChange={(event) =>
                  onFormChange({ ...reportForm, title: event.target.value })
                }
                placeholder={p.reportTitlePlaceholder}
              />
            </label>
            <label>
              {p.location}
              <input
                value={reportForm.location}
                onChange={(event) =>
                  onFormChange({ ...reportForm, location: event.target.value })
                }
                placeholder={p.locationPlaceholder}
              />
            </label>
            <label>
              {p.vulnerability}
              <textarea
                value={reportForm.vulnerability}
                onChange={(event) =>
                  onFormChange({
                    ...reportForm,
                    vulnerability: event.target.value,
                  })
                }
                placeholder={p.vulnerabilityPlaceholder}
              />
            </label>
            <label>
              {p.fix}
              <textarea
                value={reportForm.fix}
                onChange={(event) =>
                  onFormChange({ ...reportForm, fix: event.target.value })
                }
                placeholder={p.fixPlaceholder}
              />
            </label>
            <button className="primary-button" type="submit">
              <Send size={18} /> {p.submit}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
