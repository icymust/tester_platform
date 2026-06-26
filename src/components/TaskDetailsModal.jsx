import {
  ArrowLeft,
  BriefcaseBusiness,
  Calendar,
  Check,
  ClipboardList,
  ExternalLink,
  Link,
  MessageSquare,
  Pencil,
  Play,
  Search,
  Send,
  SlidersHorizontal,
  Star,
  UserRound,
  UsersRound,
  Wallet,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { DetailBlock } from "./common.jsx";
import {
  formatDeadline,
  initials,
  money,
  selectedTesterIds,
  taskPayout,
  taskSlots,
} from "../lib/platform.js";

const PRODUCT_OPTIONS = ["API", "iOS", "Android", "Web", "Backend", "Mobile"];

export function TaskDetailsModal({
  applicationText,
  currentUser,
  mode,
  onApply,
  onChooseTester,
  onClose,
  onEdit,
  onEditFormChange,
  onCompleteTesting,
  onPayTester,
  onSaveEdit,
  onStartTask,
  onTextChange,
  onViewApplications,
  onViewTaskDetails,
  onViewProfile,
  state,
  task,
  taskEditForm,
}) {
  const client = state.users.find((user) => user.id === task.clientId);
  const applications = state.applications.filter((item) => item.taskId === task.id);
  const applied = applications.find((item) => item.testerId === currentUser.id);
  const selectedIds = selectedTesterIds(task);
  const selectedTesters = selectedIds
    .map((testerId) => state.users.find((user) => user.id === testerId))
    .filter(Boolean);
  const isOwner = currentUser.id === task.clientId;
  const showApplications = isOwner && mode === "applications";
  const showReports = isOwner && mode === "reports";
  const slots = taskSlots(task);
  const canViewPrivateLink = isOwner || selectedIds.includes(currentUser.id);
  const reports = (state.reports || []).filter((report) => report.taskId === task.id);

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className={`settings-modal task-modal ${
          showApplications ? "applications-modal" : ""
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`modal-header ${
            mode === "view" && !showApplications && !showReports
              ? "overview-modal-header"
              : ""
          }`}
        >
          {(mode !== "view" || showReports) && !showApplications && (
            <div>
              <span className={`status ${task.status}`}>
                {task.status === "assigned"
                  ? "Assigned"
                  : task.status === "closed"
                    ? "Hiring closed"
                    : "Open"}
              </span>
              <h2>
                {mode === "edit"
                  ? "Edit task"
                  : showApplications
                    ? "Applications"
                    : "Reports"}
              </h2>
            </div>
          )}
          <button className="icon-button" onClick={onClose} type="button" title="Close">
            <X size={20} />
          </button>
        </div>

        {mode === "edit" && isOwner ? (
          <form className="form settings-form" onSubmit={onSaveEdit}>
            <div className="form-grid">
              <label>
                Title
                <input
                  value={taskEditForm.title}
                  onChange={(event) =>
                    onEditFormChange({ ...taskEditForm, title: event.target.value })
                  }
                  placeholder="Test a website before launch"
                />
              </label>
              <label>
                Product
                <select
                  value={taskEditForm.product}
                  onChange={(event) =>
                    onEditFormChange({ ...taskEditForm, product: event.target.value })
                  }
                >
                  <option value="">Select product</option>
                  {PRODUCT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Description
              <textarea
                value={taskEditForm.description}
                onChange={(event) =>
                  onEditFormChange({
                    ...taskEditForm,
                    description: event.target.value,
                  })
                }
                placeholder="What should be tested"
              />
            </label>
            <label>
              Expected deliverables
              <textarea
                value={taskEditForm.expected}
                onChange={(event) =>
                  onEditFormChange({ ...taskEditForm, expected: event.target.value })
                }
                placeholder="Bug report, screenshots, recommendations"
              />
            </label>
            <label>
              Budget, AED
              <input
                value={taskEditForm.budget}
                onChange={(event) =>
                  onEditFormChange({ ...taskEditForm, budget: event.target.value })
                }
                placeholder="1200"
              />
            </label>
            <label>
              Tester places
              <input
                value={taskEditForm.slots}
                onChange={(event) =>
                  onEditFormChange({ ...taskEditForm, slots: event.target.value })
                }
                placeholder="3"
              />
            </label>
            <label>
              Deadline
              <input
                value={taskEditForm.deadline}
                onChange={(event) =>
                  onEditFormChange({ ...taskEditForm, deadline: event.target.value })
                }
                type="datetime-local"
              />
            </label>
            <label>
              Private work link
              <input
                value={taskEditForm.privateLink}
                onChange={(event) =>
                  onEditFormChange({
                    ...taskEditForm,
                    privateLink: event.target.value,
                  })
                }
                placeholder="https://example.com/test-build"
              />
            </label>
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => onEditFormChange({
                  title: task.title || "",
                  product: task.product || "",
                  description: task.description || "",
                  expected: task.expected || "",
                  budget: task.budget || "",
                  slots: String(taskSlots(task)),
                  deadline: task.deadline || "",
                  privateLink: task.privateLink || "",
                })}
                type="button"
              >
                Reset
              </button>
              <button className="primary-button" type="submit">
                <Check size={18} /> Save task
              </button>
            </div>
          </form>
        ) : showApplications ? (
          <ApplicationsList
            applications={applications}
            onChooseTester={onChooseTester}
            onCompleteTesting={onCompleteTesting}
            onPayTester={onPayTester}
            onBackToTask={() => onViewTaskDetails(task.id)}
            onViewProfile={onViewProfile}
            reports={state.reports || []}
            selectedIds={selectedIds}
            slots={slots}
            state={state}
            task={task}
          />
        ) : showReports ? (
          <ReportsList reports={reports} state={state} />
        ) : (
          <div className="task-overview">
            <div className="task-overview-hero">
              <div>
                <div className="task-title-row">
                  <h2>{task.title}</h2>
                  <span className={`status ${task.status}`}>
                    {task.status === "assigned"
                      ? "Assigned"
                      : task.status === "closed"
                        ? "Hiring closed"
                        : "Open"}
                  </span>
                </div>
                <p>
                  <ClipboardList size={17} />
                  {task.description || "No description provided."}
                </p>
              </div>
              {isOwner && (
                <button
                  className="secondary-button small edit-accent"
                  onClick={onEdit}
                  type="button"
                >
                  <Pencil size={17} /> Edit task
                </button>
              )}
            </div>

            <div className="task-overview-stats">
              <OverviewTile
                icon={<BriefcaseBusiness size={18} />}
                label="Product"
                value={task.product || "Not specified"}
              />
              <OverviewTile
                icon={<Calendar size={18} />}
                label="Created"
                value={task.createdAt || "Today"}
              />
              <OverviewTile
                icon={<Wallet size={18} />}
                label={currentUser.role === "tester" ? "Your payout" : "Total budget"}
                value={money(currentUser.role === "tester" ? taskPayout(task) : task.budget)}
              />
              <OverviewTile
                icon={<Calendar size={18} />}
                label="Deadline"
                value={formatDeadline(task.deadline)}
              />
            </div>

            <div className="overview-card wide">
              <span>Requirements and deliverables</span>
              <strong>{task.expected || "No requirements provided."}</strong>
            </div>

            <div className="overview-card-grid">
              {canViewPrivateLink && task.privateLink && (
                <div className="overview-card link-card">
                  <span>
                    <Link size={17} /> Private work link
                  </span>
                  <a
                    className="work-link"
                    href={task.privateLink}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {task.privateLink}
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}

              <OverviewPanel
                icon={<UsersRound size={18} />}
                label="Places"
                value={`${selectedIds.length} / ${slots} selected`}
              />

              <OverviewPanel
                icon={<UserRound size={18} />}
                label="Client"
                value={client?.name || "Company"}
                avatar={client?.name}
              />

              <OverviewPanel
                icon={<UsersRound size={18} />}
                label="Applications"
                value={`${applications.length} application${applications.length === 1 ? "" : "s"} submitted`}
              />
            </div>

            {selectedTesters.length > 0 && (
              <div className="selected-banner">
                <Check size={18} /> Selected testers:{" "}
                {selectedTesters.map((tester) => tester.name).join(", ")}
              </div>
            )}

            {currentUser.role === "tester" && (
              <div className="detail-section">
                <h3>Your application</h3>
                {applied ? (
                  <div className={`application-state ${applied.status} state-with-action`}>
                    <span>
                      {applied.status === "selected"
                        ? "You were selected for this task"
                        : applied.status === "rejected"
                          ? "The client selected another tester"
                          : "Application sent"}
                    </span>
                    {applied.status === "selected" && (
                      <button
                        className="start-button"
                        onClick={() => onStartTask(task.id)}
                        type="button"
                      >
                        <Play size={17} /> Start
                      </button>
                    )}
                  </div>
                ) : task.status === "closed" ? (
                  <div className="application-state rejected">
                    This task is closed for new applications
                  </div>
                ) : selectedIds.length >= slots ? (
                  <div className="application-state rejected">
                    All tester places are filled
                  </div>
                ) : (
                  <div className="apply-row">
                    <input
                      value={applicationText[task.id] || ""}
                      onChange={(event) =>
                        onTextChange({
                          ...applicationText,
                          [task.id]: event.target.value,
                        })
                      }
                      placeholder="Briefly explain why you are a good fit"
                    />
                    <button
                      className="primary-button small"
                      onClick={() => onApply(task.id)}
                      type="button"
                    >
                      <Send size={17} /> Apply
                    </button>
                  </div>
                )}
              </div>
            )}

            {isOwner && (
              <div className="overview-actions">
                <button className="secondary-button" onClick={onClose} type="button">
                  Close
                </button>
                <button
                  className="primary-button view-applications-button"
                  onClick={() => onViewApplications(task.id)}
                  type="button"
                >
                  <UsersRound size={18} /> View applications
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function OverviewTile({ icon, label, value }) {
  return (
    <div className="overview-tile">
      <span>{label}</span>
      <strong>
        {icon}
        {value}
      </strong>
    </div>
  );
}

function OverviewPanel({ avatar, icon, label, value }) {
  return (
    <div className="overview-card compact">
      <span>
        {icon}
        {label}
      </span>
      <strong>
        {avatar && <span className="avatar mini">{initials(avatar)}</span>}
        {value}
      </strong>
    </div>
  );
}

function ReportsList({ reports, state }) {
  const [activeReportId, setActiveReportId] = useState("");

  if (reports.length === 0) {
    return <p className="muted">No reports submitted yet.</p>;
  }

  return (
    <div className="report-list">
      {reports.map((report) => {
        const tester = state.users.find((user) => user.id === report.testerId);
        const isOpen = activeReportId === report.id;
        return (
          <article className={`report-row ${isOpen ? "active" : ""}`} key={report.id}>
            <button
              className="report-summary"
              onClick={() => setActiveReportId(isOpen ? "" : report.id)}
              type="button"
            >
              <strong>{report.title}</strong>
              <span>By {tester?.name || "Tester"}</span>
              <span>{formatDeadline(report.createdAt)}</span>
            </button>
            {isOpen && (
              <div className="report-detail">
                <DetailBlock label="Found at" value={report.location || "Not specified"} />
                <div className="cv-section">
                  <h3>Vulnerability / bug details</h3>
                  <p>{report.vulnerability || "No details provided."}</p>
                </div>
                <div className="cv-section">
                  <h3>Suggested fix</h3>
                  <p>{report.fix || "No fix suggested."}</p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function ApplicationsList({
  applications,
  onBackToTask,
  onChooseTester,
  onCompleteTesting,
  onPayTester,
  onViewProfile,
  reports,
  selectedIds,
  slots,
  state,
  task,
}) {
  const [filter, setFilter] = useState("all");
  const [activeApplicationId, setActiveApplicationId] = useState(
    applications[0]?.id || "",
  );
  const [reportsOpen, setReportsOpen] = useState(false);
  const visibleApplications =
    filter === "selected"
      ? applications.filter((application) => selectedIds.includes(application.testerId))
      : applications;
  const selectedApplications = applications.filter((application) =>
    selectedIds.includes(application.testerId),
  );
  const completedApplications = applications.filter(
    (application) => application.completed,
  );
  const activeApplication =
    applications.find((application) => application.id === activeApplicationId) ||
    visibleApplications[0] ||
    applications[0];
  const activeTester = state.users.find(
    (user) => user.id === activeApplication?.testerId,
  );
  const activeReports = reports.filter(
    (report) =>
      report.taskId === task.id && report.testerId === activeApplication?.testerId,
  );
  const activeIsSelected = activeApplication
    ? selectedIds.includes(activeApplication.testerId)
    : false;
  const activeIsCompleted = Boolean(activeApplication?.completed);
  const activeRating = testerRating(activeTester, 0);

  return (
    <div className="applications-workspace">
      <section className="applications-center">
        <div className="applications-heading">
          <div>
            <button className="back-link" onClick={onBackToTask} type="button">
              <ArrowLeft size={17} /> Back to task
            </button>
            <h2>Applications for {task.title}</h2>
          </div>
          <div className="applications-metrics">
            <MetricMini value={1} label="Active task" />
            <MetricMini value={slots} label="Places" />
            <MetricMini value={money(task.budget)} label="Total budget" />
          </div>
        </div>

        <div className="applications-list-panel">
          <div className="applications-tabs">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
              type="button"
            >
              Applications ({applications.length})
            </button>
            <button
              className={filter === "selected" ? "active" : ""}
              onClick={() => setFilter("selected")}
              type="button"
            >
              Selected ({selectedApplications.length})
            </button>
            <button type="button">Completed ({completedApplications.length})</button>
          </div>

          <div className="applications-tools">
            <label className="applications-search">
              <Search size={17} />
              <input placeholder="Search by name..." />
            </label>
            <button className="secondary-button small" type="button">
              <SlidersHorizontal size={16} /> Filters
            </button>
            <select aria-label="Sort applications">
              <option>Newest first</option>
              <option>Top rated</option>
              <option>Most reports</option>
            </select>
          </div>

          <div className="candidate-list">
            {visibleApplications.length === 0 && (
              <p className="empty-state">No applicants in this group yet.</p>
            )}
            {visibleApplications.map((application, index) => {
              const tester = state.users.find(
                (user) => user.id === application.testerId,
              );
              const isSelected = selectedIds.includes(application.testerId);
              const reportCount = reports.filter(
                (report) =>
                  report.taskId === task.id && report.testerId === application.testerId,
              ).length;
              const rating = testerRating(tester, index);
              return (
                <article
                  className={`candidate-row ${
                    activeApplication?.id === application.id ? "active" : ""
                  }`}
                  key={application.id}
                  onClick={() => setActiveApplicationId(application.id)}
                >
                  <span className="avatar">{initials(tester?.name || "QA")}</span>
                  <div className="candidate-main">
                    <div className="candidate-title">
                      <strong>{tester?.name || "Tester"}</strong>
                      {index === 0 && <span className="tag">Top rated</span>}
                      <span className="rating">
                        <Star size={15} fill="currentColor" /> {rating}
                      </span>
                    </div>
                    <p>{tester?.skills || "QA Tester"}</p>
                    <span>Applied {formatDeadline(application.createdAt || task.createdAt)}</span>
                  </div>
                  <div className="candidate-stat">
                    <span>Reports</span>
                    <strong>{reportCount}</strong>
                  </div>
                  <div className="candidate-stat">
                    <span>Success rate</span>
                    <strong>{Math.max(91, Math.round(Number(rating) * 20))}%</strong>
                  </div>
                  <span className={`application-badge ${isSelected ? "selected" : ""}`}>
                    {isSelected ? "Selected" : "Applied"}
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <aside className="applicant-detail-panel">
        <button className="back-link" onClick={onBackToTask} type="button">
          <ArrowLeft size={17} /> Back to task
        </button>
        {activeApplication && activeTester ? (
          <>
            <div className="applicant-profile-head">
              <span className="avatar large">{initials(activeTester.name || "QA")}</span>
              <div>
                <button
                  className="profile-name-link"
                  onClick={() => onViewProfile(activeTester.id)}
                  type="button"
                >
                  {activeTester.name}
                </button>
                <p>{activeTester.skills || "QA Tester"}</p>
                <span>{activeIsSelected ? "Selected" : "Applied"} · {activeRating} rating</span>
              </div>
              {activeIsSelected && <span className="tag success">Selected</span>}
            </div>

            <div className="detail-mini-card">
              <span>Payout for this task</span>
              <strong>{money(taskPayout(task))}</strong>
            </div>

            <div className="testing-status-card">
              <h4>Status</h4>
              <div className={`status-step ${activeIsSelected ? "active" : ""}`}>
                <span />
                <div>
                  <strong>Testing in progress</strong>
                  <p>
                    {activeIsSelected
                      ? "Tester can submit multiple reports. You review each one."
                      : "Select tester to start testing."}
                  </p>
                </div>
              </div>
              <button
                className={`status-step status-step-button ${
                  activeIsCompleted ? "active" : ""
                }`}
                disabled={!activeIsSelected || activeIsCompleted}
                onClick={() => onCompleteTesting(task.id, activeApplication.testerId)}
                type="button"
              >
                <span />
                <div>
                  <strong>Complete testing</strong>
                  <p>
                    {activeIsCompleted
                      ? "Testing is marked as completed."
                      : "Mark the testing as completed when you are satisfied."}
                  </p>
                </div>
              </button>
              <div className={`status-step ${activeApplication.paid ? "active" : ""}`}>
                <span />
                <div>
                  <strong>Payment</strong>
                  <p>Tester will be paid {money(taskPayout(task))}.</p>
                </div>
              </div>
            </div>

            <div className="detail-reports">
              <div className="section-row">
                <h4>Reports ({activeReports.length})</h4>
                <button
                  className="secondary-button small"
                  disabled={activeReports.length === 0}
                  onClick={() => setReportsOpen(true)}
                  type="button"
                >
                  View all reports
                </button>
              </div>
              {activeReports.length === 0 ? (
                <p className="muted">No reports from this tester yet.</p>
              ) : (
                activeReports.map((report, index) => (
                  <button className="report-mini-row" key={report.id} type="button">
                    <strong>#{activeReports.length - index}</strong>
                    <span>{formatDeadline(report.createdAt)}</span>
                    <em>{index === 0 ? "Pending review" : "Approved"}</em>
                  </button>
                ))
              )}
            </div>

            <div className="applicant-detail-actions">
              <button className="secondary-button" type="button">
                <MessageSquare size={17} /> Message tester
              </button>
              {activeIsSelected ? (
                <button
                  className="pay-button"
                  disabled={!activeIsCompleted || activeApplication.paid}
                  onClick={() => onPayTester(task.id, activeApplication.testerId)}
                  type="button"
                >
                  {activeApplication.paid
                    ? "Paid"
                    : activeIsCompleted
                      ? `Pay ${money(taskPayout(task))}`
                      : "Complete testing first"}
                </button>
              ) : (
                <button
                  className="pay-button"
                  disabled={selectedIds.length >= slots}
                  onClick={() => onChooseTester(task.id, activeApplication.testerId)}
                  type="button"
                >
                  Select tester
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="empty-state">Select an applicant to view details.</p>
        )}
      </aside>

      {reportsOpen && (
        <ReportsViewerModal
          onClose={() => setReportsOpen(false)}
          reports={activeReports}
          task={task}
          tester={activeTester}
        />
      )}
    </div>
  );
}

function ReportsViewerModal({ onClose, reports, task, tester }) {
  const [activeReportId, setActiveReportId] = useState(reports[0]?.id || "");
  const activeReport =
    reports.find((report) => report.id === activeReportId) || reports[0];

  return (
    <div className="nested-modal-backdrop" role="presentation">
      <section className="reports-viewer-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <span className="step-pill">Reports</span>
            <h2>{tester?.name || "Tester"} reports</h2>
            <p className="muted">{task.title}</p>
          </div>
          <button className="icon-button" onClick={onClose} type="button" title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="reports-viewer-grid">
          <div className="reports-viewer-list">
            {reports.map((report, index) => (
              <button
                className={`report-viewer-item ${
                  activeReport?.id === report.id ? "active" : ""
                }`}
                key={report.id}
                onClick={() => setActiveReportId(report.id)}
                type="button"
              >
                <strong>#{reports.length - index} {report.title}</strong>
                <span>{formatDeadline(report.createdAt)}</span>
              </button>
            ))}
          </div>

          {activeReport ? (
            <article className="report-viewer-detail">
              <DetailBlock
                label="Found at"
                value={activeReport.location || "Not specified"}
              />
              <div className="cv-section">
                <h3>Vulnerability / bug details</h3>
                <p>{activeReport.vulnerability || "No details provided."}</p>
              </div>
              <div className="cv-section">
                <h3>Suggested fix</h3>
                <p>{activeReport.fix || "No fix suggested."}</p>
              </div>
            </article>
          ) : (
            <p className="empty-state">No reports to show.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricMini({ label, value }) {
  return (
    <div className="metric-mini">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function testerRating(tester, index) {
  if (tester?.rating) return tester.rating;
  const name = tester?.name || tester?.login || String(index);
  const score = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (4.5 + (score % 5) / 10).toFixed(1);
}
