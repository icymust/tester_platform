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
  t,
  task,
  taskEditForm,
}) {
  const p = t.platform;
  const statusLabel = (status) => p.status[status] || status;
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
                {statusLabel(task.status)}
              </span>
              <h2>
                {mode === "edit"
                  ? p.task.editTask
                  : showApplications
                    ? p.task.applications
                    : p.task.reports}
              </h2>
            </div>
          )}
          <button className="icon-button" onClick={onClose} type="button" title={p.task.close}>
            <X size={20} />
          </button>
        </div>

        {mode === "edit" && isOwner ? (
          <form className="form settings-form" onSubmit={onSaveEdit}>
            <div className="form-grid">
              <label>
                {p.task.title}
                <input
                  value={taskEditForm.title}
                  onChange={(event) =>
                    onEditFormChange({ ...taskEditForm, title: event.target.value })
                  }
                  placeholder={p.task.titlePlaceholder}
                />
              </label>
              <label>
                {p.task.product}
                <select
                  value={taskEditForm.product}
                  onChange={(event) =>
                    onEditFormChange({ ...taskEditForm, product: event.target.value })
                  }
                >
                  <option value="">{p.task.selectProduct}</option>
                  {PRODUCT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              {p.task.description}
              <textarea
                value={taskEditForm.description}
                onChange={(event) =>
                  onEditFormChange({
                    ...taskEditForm,
                    description: event.target.value,
                  })
                }
                placeholder={p.task.descriptionPlaceholder}
              />
            </label>
            <label>
              {p.task.expected}
              <textarea
                value={taskEditForm.expected}
                onChange={(event) =>
                  onEditFormChange({ ...taskEditForm, expected: event.target.value })
                }
                placeholder={p.task.expectedPlaceholder}
              />
            </label>
            <label>
              {p.task.budgetAed}
              <input
                value={taskEditForm.budget}
                onChange={(event) =>
                  onEditFormChange({ ...taskEditForm, budget: event.target.value })
                }
                placeholder="1200"
              />
            </label>
            <label>
              {p.task.testerPlaces}
              <input
                value={taskEditForm.slots}
                onChange={(event) =>
                  onEditFormChange({ ...taskEditForm, slots: event.target.value })
                }
                placeholder="3"
              />
            </label>
            <label>
              {p.task.deadline}
              <input
                value={taskEditForm.deadline}
                onChange={(event) =>
                  onEditFormChange({ ...taskEditForm, deadline: event.target.value })
                }
                type="datetime-local"
              />
            </label>
            <label>
              {p.task.privateLink}
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
                {p.task.reset}
              </button>
              <button className="primary-button" type="submit">
                <Check size={18} /> {p.task.saveTask}
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
            t={t}
          />
        ) : showReports ? (
          <ReportsList reports={reports} state={state} t={t} />
        ) : (
          <div className="task-overview">
            <div className="task-overview-hero">
              <div>
                <div className="task-title-row">
                  <h2>{task.title}</h2>
                  <span className={`status ${task.status}`}>
                    {statusLabel(task.status)}
                  </span>
                </div>
                <p>
                  <ClipboardList size={17} />
                  {task.description || p.task.noDescription}
                </p>
              </div>
              {isOwner && (
                <button
                  className="secondary-button small edit-accent"
                  onClick={onEdit}
                  type="button"
                >
                  <Pencil size={17} /> {p.task.editTask}
                </button>
              )}
            </div>

            <div className="task-overview-stats">
              <OverviewTile
                icon={<BriefcaseBusiness size={18} />}
                label={p.task.product}
                value={task.product || p.task.notSpecified}
              />
              <OverviewTile
                icon={<Calendar size={18} />}
                label={p.task.created}
                value={task.createdAt || p.task.today}
              />
              <OverviewTile
                icon={<Wallet size={18} />}
                label={currentUser.role === "tester" ? p.task.yourPayout : p.task.totalBudget}
                value={money(currentUser.role === "tester" ? taskPayout(task) : task.budget)}
              />
              <OverviewTile
                icon={<Calendar size={18} />}
                label={p.task.deadline}
                value={formatDeadline(task.deadline)}
              />
            </div>

            <div className="overview-card wide">
              <span>{p.task.requirements}</span>
              <strong>{task.expected || p.task.noRequirements}</strong>
            </div>

            <div className="overview-card-grid">
              {canViewPrivateLink && task.privateLink && (
                <div className="overview-card link-card">
                  <span>
                    <Link size={17} /> {p.task.privateLink}
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
                label={p.task.places}
                value={`${selectedIds.length} / ${slots} ${p.task.selected}`}
              />

              <OverviewPanel
                icon={<UserRound size={18} />}
                label={p.task.client}
                value={client?.name || p.task.company}
                avatar={client?.name}
              />

              <OverviewPanel
                icon={<UsersRound size={18} />}
                label={p.task.applications}
                value={`${applications.length} ${p.task.applications} ${p.task.submitted}`}
              />
            </div>

            {selectedTesters.length > 0 && (
              <div className="selected-banner">
                <Check size={18} /> {p.task.selectedTesters}{" "}
                {selectedTesters.map((tester) => tester.name).join(", ")}
              </div>
            )}

            {currentUser.role === "tester" && (
              <div className="detail-section">
                <h3>{p.task.yourApplication}</h3>
                {applied ? (
                  <div className={`application-state ${applied.status} state-with-action`}>
                    <span>
                      {applied.status === "selected"
                        ? p.task.selectedForTask
                        : applied.status === "rejected"
                          ? p.task.anotherTester
                          : p.task.applicationSent}
                    </span>
                    {applied.status === "selected" && (
                      <button
                        className="start-button"
                        onClick={() => onStartTask(task.id)}
                        type="button"
                      >
                        <Play size={17} /> {p.task.start}
                      </button>
                    )}
                  </div>
                ) : task.status === "closed" ? (
                  <div className="application-state rejected">
                    {p.task.taskClosed}
                  </div>
                ) : selectedIds.length >= slots ? (
                  <div className="application-state rejected">
                    {p.task.allPlacesFilled}
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
                      placeholder={p.task.applyPlaceholder}
                    />
                    <button
                      className="primary-button small"
                      onClick={() => onApply(task.id)}
                      type="button"
                    >
                      <Send size={17} /> {p.task.apply}
                    </button>
                  </div>
                )}
              </div>
            )}

            {isOwner && (
              <div className="overview-actions">
                <button className="secondary-button" onClick={onClose} type="button">
                  {p.task.close}
                </button>
                <button
                  className="primary-button view-applications-button"
                  onClick={() => onViewApplications(task.id)}
                  type="button"
                >
                  <UsersRound size={18} /> {p.task.viewApplications}
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

function ReportsList({ reports, state, t }) {
  const p = t.platform;
  const [activeReportId, setActiveReportId] = useState("");

  if (reports.length === 0) {
    return <p className="muted">{p.task.noReports}</p>;
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
              <span>{p.task.by} {tester?.name || t.common.tester}</span>
              <span>{formatDeadline(report.createdAt)}</span>
            </button>
            {isOpen && (
              <div className="report-detail">
                <DetailBlock label={p.task.foundAt} value={report.location || p.task.notSpecified} />
                <div className="cv-section">
                  <h3>{p.task.bugDetails}</h3>
                  <p>{report.vulnerability || p.task.noDetails}</p>
                </div>
                <div className="cv-section">
                  <h3>{p.task.suggestedFix}</h3>
                  <p>{report.fix || p.task.noFix}</p>
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
  t,
}) {
  const p = t.platform;
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
              <ArrowLeft size={17} /> {p.task.backToTask}
            </button>
            <h2>{p.task.applicationsFor} {task.title}</h2>
          </div>
          <div className="applications-metrics">
            <MetricMini value={1} label={p.task.activeTask} />
            <MetricMini value={slots} label={p.task.places} />
            <MetricMini value={money(task.budget)} label={p.task.totalBudget} />
          </div>
        </div>

        <div className="applications-list-panel">
          <div className="applications-tabs">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
              type="button"
            >
              {p.task.applications} ({applications.length})
            </button>
            <button
              className={filter === "selected" ? "active" : ""}
              onClick={() => setFilter("selected")}
              type="button"
            >
              {p.status.selected} ({selectedApplications.length})
            </button>
            <button type="button">{p.tester.completed} ({completedApplications.length})</button>
          </div>

          <div className="applications-tools">
            <label className="applications-search">
              <Search size={17} />
              <input placeholder={p.task.searchByName} />
            </label>
            <button className="secondary-button small" type="button">
              <SlidersHorizontal size={16} /> {p.task.filters}
            </button>
            <select aria-label={p.task.sortApplications}>
              <option>{p.task.newestFirst}</option>
              <option>{p.task.topRated}</option>
              <option>{p.task.mostReports}</option>
            </select>
          </div>

          <div className="candidate-list">
            {visibleApplications.length === 0 && (
              <p className="empty-state">{p.task.noApplicants}</p>
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
                      <strong>{tester?.name || t.common.tester}</strong>
                      {index === 0 && <span className="tag">{p.task.topRated}</span>}
                      <span className="rating">
                        <Star size={15} fill="currentColor" /> {rating}
                      </span>
                    </div>
                    <p>{tester?.skills || p.task.qaTester}</p>
                    <span>{p.task.applied} {formatDeadline(application.createdAt || task.createdAt)}</span>
                  </div>
                  <div className="candidate-stat">
                    <span>{p.task.reportCount}</span>
                    <strong>{reportCount}</strong>
                  </div>
                  <div className="candidate-stat">
                    <span>{p.task.successRate}</span>
                    <strong>{Math.max(91, Math.round(Number(rating) * 20))}%</strong>
                  </div>
                  <span className={`application-badge ${isSelected ? "selected" : ""}`}>
                    {isSelected ? p.status.selected : p.task.applied}
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <aside className="applicant-detail-panel">
        <button className="back-link" onClick={onBackToTask} type="button">
          <ArrowLeft size={17} /> {p.task.backToTask}
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
                <p>{activeTester.skills || p.task.qaTester}</p>
                <span>{activeIsSelected ? p.status.selected : p.task.applied} · {activeRating} {p.task.rating}</span>
              </div>
              {activeIsSelected && <span className="tag success">{p.status.selected}</span>}
            </div>

            <div className="detail-mini-card">
              <span>{p.task.payoutForTask}</span>
              <strong>{money(taskPayout(task))}</strong>
            </div>

            <div className="testing-status-card">
              <h4>{p.task.status}</h4>
              <div className={`status-step ${activeIsSelected ? "active" : ""}`}>
                <span />
                <div>
                  <strong>{p.task.testingInProgress}</strong>
                  <p>
                    {activeIsSelected
                      ? p.task.selectedTestingHint
                      : p.task.selectTesterHint}
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
                  <strong>{p.task.completeTesting}</strong>
                  <p>
                    {activeIsCompleted
                      ? p.task.completedTesting
                      : p.task.completeTestingHint}
                  </p>
                </div>
              </button>
              <div className={`status-step ${activeApplication.paid ? "active" : ""}`}>
                <span />
                <div>
                  <strong>{p.task.payment}</strong>
                  <p>{p.task.willBePaid} {money(taskPayout(task))}.</p>
                </div>
              </div>
            </div>

            <div className="detail-reports">
              <div className="section-row">
                <h4>{p.task.reports} ({activeReports.length})</h4>
                <button
                  className="secondary-button small"
                  disabled={activeReports.length === 0}
                  onClick={() => setReportsOpen(true)}
                  type="button"
                >
                  {p.task.viewAllReports}
                </button>
              </div>
              {activeReports.length === 0 ? (
                <p className="muted">{p.task.noTesterReports}</p>
              ) : (
                activeReports.map((report, index) => (
                  <button className="report-mini-row" key={report.id} type="button">
                    <strong>#{activeReports.length - index}</strong>
                    <span>{formatDeadline(report.createdAt)}</span>
                    <em>{index === 0 ? p.task.pendingReview : p.task.approved}</em>
                  </button>
                ))
              )}
            </div>

            <div className="applicant-detail-actions">
              <button className="secondary-button" type="button">
                <MessageSquare size={17} /> {p.task.messageTester}
              </button>
              {activeIsSelected ? (
                <button
                  className="pay-button"
                  disabled={!activeIsCompleted || activeApplication.paid}
                  onClick={() => onPayTester(task.id, activeApplication.testerId)}
                  type="button"
                >
                  {activeApplication.paid
                    ? p.task.paid
                    : activeIsCompleted
                      ? `${p.task.pay} ${money(taskPayout(task))}`
                      : p.task.completeFirst}
                </button>
              ) : (
                <button
                  className="pay-button"
                  disabled={selectedIds.length >= slots}
                  onClick={() => onChooseTester(task.id, activeApplication.testerId)}
                  type="button"
                >
                  {p.task.selectTester}
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="empty-state">{p.task.selectApplicant}</p>
        )}
      </aside>

      {reportsOpen && (
        <ReportsViewerModal
          onClose={() => setReportsOpen(false)}
          reports={activeReports}
          t={t}
          task={task}
          tester={activeTester}
        />
      )}
    </div>
  );
}

function ReportsViewerModal({ onClose, reports, t, task, tester }) {
  const p = t.platform;
  const [activeReportId, setActiveReportId] = useState(reports[0]?.id || "");
  const activeReport =
    reports.find((report) => report.id === activeReportId) || reports[0];

  return (
    <div className="nested-modal-backdrop" role="presentation">
      <section className="reports-viewer-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <span className="step-pill">{p.task.reports}</span>
            <h2>{tester?.name || t.common.tester} {p.task.reportsOf}</h2>
            <p className="muted">{task.title}</p>
          </div>
          <button className="icon-button" onClick={onClose} type="button" title={p.task.close}>
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
                label={p.task.foundAt}
                value={activeReport.location || p.task.notSpecified}
              />
              <div className="cv-section">
                <h3>{p.task.bugDetails}</h3>
                <p>{activeReport.vulnerability || p.task.noDetails}</p>
              </div>
              <div className="cv-section">
                <h3>{p.task.suggestedFix}</h3>
                <p>{activeReport.fix || p.task.noFix}</p>
              </div>
            </article>
          ) : (
            <p className="empty-state">{p.task.noReportsToShow}</p>
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
