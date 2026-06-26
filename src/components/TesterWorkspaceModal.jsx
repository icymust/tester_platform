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
  task,
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="settings-modal workspace-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <span className="step-pill">Testing workspace</span>
            <h2>{task.title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button" title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="task-detail-grid">
          <DetailBlock label="Product" value={task.product} />
          <DetailBlock label="Your payout" value={money(taskPayout(task))} />
          <DetailBlock label="Deadline" value={formatDeadline(task.deadline)} />
          <DetailBlock label="Tester" value={currentUser.name} />
        </div>

        <div className="detail-section">
          <h3>Testing target</h3>
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
            <p>No private work link was provided.</p>
          )}
        </div>

        <div className="detail-section">
          <h3>Requirements and deliverables</h3>
          <p>{task.expected || "No requirements provided."}</p>
        </div>

        <div className="workspace-actions">
          <button className="danger-button" onClick={onReportToggle} type="button">
            <Bug size={18} /> Report bug
          </button>
        </div>

        {reportFormOpen && (
          <form className="form report-form" onSubmit={onSubmitReport}>
            <label>
              Report title
              <input
                value={reportForm.title}
                onChange={(event) =>
                  onFormChange({ ...reportForm, title: event.target.value })
                }
                placeholder="Payment flow exposes internal error"
              />
            </label>
            <label>
              Where did you find it?
              <input
                value={reportForm.location}
                onChange={(event) =>
                  onFormChange({ ...reportForm, location: event.target.value })
                }
                placeholder="URL, screen, endpoint, or user flow"
              />
            </label>
            <label>
              Vulnerability / bug details
              <textarea
                value={reportForm.vulnerability}
                onChange={(event) =>
                  onFormChange({
                    ...reportForm,
                    vulnerability: event.target.value,
                  })
                }
                placeholder="What happened, why it matters, and how to reproduce it"
              />
            </label>
            <label>
              Suggested fix
              <textarea
                value={reportForm.fix}
                onChange={(event) =>
                  onFormChange({ ...reportForm, fix: event.target.value })
                }
                placeholder="How the client can fix or reduce the issue"
              />
            </label>
            <button className="primary-button" type="submit">
              <Send size={18} /> Send report
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
