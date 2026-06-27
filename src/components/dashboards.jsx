import {
  BarChart3,
  BriefcaseBusiness,
  Calendar,
  Check,
  Code2,
  ClipboardList,
  Eye,
  Globe,
  ListChecks,
  MessageSquare,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  Smartphone,
  Trash2,
  UserRound,
  Wallet,
  UsersRound,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Metric } from "./common.jsx";
import {
  formatDeadline,
  initials,
  money,
  selectedTesterIds,
  taskPayout,
  taskSlots,
} from "../lib/platform.js";

const PRODUCT_OPTIONS = ["API", "iOS", "Android", "Web", "Backend", "Mobile"];

function productKey(product = "") {
  const normalized = product.toLowerCase();
  if (normalized.includes("ios")) return "ios";
  if (normalized.includes("android") || normalized.includes("mobile")) return "mobile";
  if (normalized.includes("web")) return "web";
  if (normalized.includes("api") || normalized.includes("backend")) return "api";
  return "web";
}

function productLabel(product = "") {
  const normalized = product.toLowerCase();
  if (normalized.includes("ios")) return "iOS";
  if (normalized.includes("android")) return <Smartphone size={30} />;
  if (normalized.includes("mobile")) return <Smartphone size={30} />;
  if (normalized.includes("web")) return <Globe size={30} />;
  if (normalized.includes("api")) return "API";
  if (normalized.includes("backend")) return <Code2 size={30} />;
  return "QA";
}

function testerPaymentRows(applications, tasks) {
  return applications
    .filter((application) => application.status === "selected")
    .map((application) => {
      const task = tasks.find((item) => item.id === application.taskId);
      return task ? { application, payout: taskPayout(task), task } : null;
    })
    .filter(Boolean);
}

function clientPaymentRows(tasks, applications) {
  return tasks.map((task) => {
    const payout = taskPayout(task);
    const selectedApplications = applications.filter(
      (application) =>
        application.taskId === task.id &&
        selectedTesterIds(task).includes(application.testerId),
    );
    const paidCount = selectedApplications.filter((item) => item.paid).length;
    const unpaidCount = selectedApplications.length - paidCount;
    return {
      paid: paidCount * payout,
      paidCount,
      payout,
      remaining: Math.max(0, (Number(task.budget) || 0) - paidCount * payout),
      reserved: unpaidCount * payout,
      selectedCount: selectedApplications.length,
      task,
    };
  });
}

export function TesterDashboard({
  applicationText,
  currentUser,
  onApply,
  onOpenProfile,
  onOpenSettings,
  onSendMessage,
  onStartTask,
  onViewTask,
  onSearch,
  onTextChange,
  onViewChange,
  search,
  state,
  t,
  view,
}) {
  const p = t.platform;
  const [activeReportId, setActiveReportId] = useState("");
  const myApplications = state.applications.filter(
    (item) => item.testerId === currentUser.id,
  );
  const myReports = useMemo(
    () =>
      [...(state.reports || [])]
        .filter((report) => report.testerId === currentUser.id)
        .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt)),
    [currentUser.id, state.reports],
  );
  const selectedApplicationTaskIds = useMemo(
    () =>
      new Set(
        state.applications
          .filter((item) => item.testerId === currentUser.id)
          .filter((item) => item.status === "selected")
          .map((item) => item.taskId),
      ),
    [currentUser.id, state.applications],
  );

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sourceTasks =
      view === "my-tasks"
        ? state.tasks.filter((task) => selectedApplicationTaskIds.has(task.id))
        : state.tasks;

    return sourceTasks.filter((task) => {
      if (!query) return true;
      return [task.title, task.product, task.description]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [search, selectedApplicationTaskIds, state.tasks, view]);

  const isMyTasksView = view === "my-tasks";
  const appliedCount = myApplications.length;
  const inProgressCount = myApplications.filter(
    (item) => item.status === "selected" && !item.completed,
  ).length;
  const completedCount = myApplications.filter((item) => item.completed).length;
  const isPaymentsView = view === "payments";
  const isReportsView = view === "reports";
  const isMessagesView = view === "messages";
  const testerPayments = testerPaymentRows(myApplications, state.tasks);
  const reportedTaskIds = new Set(myReports.map((report) => report.taskId));
  const activeReport =
    myReports.find((report) => report.id === activeReportId) || myReports[0];
  const earnedTotal = testerPayments
    .filter((row) => row.application.paid)
    .reduce((sum, row) => sum + row.payout, 0);
  const pendingTotal = testerPayments
    .filter((row) => !row.application.paid)
    .reduce((sum, row) => sum + row.payout, 0);

  React.useEffect(() => {
    if (!myReports.length) {
      if (activeReportId) setActiveReportId("");
      return;
    }

    if (!myReports.some((report) => report.id === activeReportId)) {
      setActiveReportId(myReports[0].id);
    }
  }, [activeReportId, myReports]);

  return (
    <div className="tester-dashboard">
      <aside className="client-page-sidebar tester-page-sidebar">
        <nav className="applications-nav">
          <button
            className={view === "available" ? "active" : ""}
            onClick={() => onViewChange("available")}
            type="button"
          >
            <ClipboardList size={17} /> {p.nav.allTasks}
          </button>
          <button
            className={view === "my-tasks" ? "active" : ""}
            onClick={() => onViewChange("my-tasks")}
            type="button"
          >
            <ListChecks size={17} /> {p.nav.myTasks}
          </button>
          <button type="button">
            <BriefcaseBusiness size={17} /> {p.nav.applications}
          </button>
          <button
            className={isReportsView ? "active" : ""}
            onClick={() => onViewChange("reports")}
            type="button"
          >
            <BarChart3 size={17} /> {p.nav.reports}
          </button>
          <button
            className={isPaymentsView ? "active" : ""}
            onClick={() => onViewChange("payments")}
            type="button"
          >
            <Wallet size={17} /> {p.nav.payments}
          </button>
          <button
            className={isMessagesView ? "active" : ""}
            onClick={() => onViewChange("messages")}
            type="button"
          >
            <MessageSquare size={17} /> {p.nav.messages}
          </button>
          <button onClick={() => onOpenProfile(currentUser.id)} type="button">
            <UserRound size={17} /> {p.nav.profile}
          </button>
          <button onClick={onOpenSettings} type="button">
            <Settings size={17} /> {p.nav.settings}
          </button>
        </nav>
      </aside>

      <section className="tester-main-panel">
        {isReportsView ? (
          <div>
            <div className="tester-board-heading">
              <div>
                <h1>{p.tester.myReports}</h1>
                <p>{p.tester.reportsSubtitle}</p>
              </div>
              <div className="tester-metrics">
                <Metric value={myReports.length} label={p.nav.reports} />
                <Metric value={reportedTaskIds.size} label={p.tester.tasksCovered} />
                <Metric value={myReports.filter((report) => report.location).length} label={p.tester.withLocation} />
                <Metric value={myReports.filter((report) => report.fix).length} label={p.tester.withFix} />
              </div>
            </div>

            {myReports.length === 0 ? (
              <p className="empty-state">{p.tester.noReports}</p>
            ) : (
              <div className="reports-viewer-grid">
                <div className="reports-viewer-list">
                  {myReports.map((report) => {
                    const task = state.tasks.find((item) => item.id === report.taskId);
                    const isOpen = activeReport?.id === report.id;
                    return (
                      <article className={`report-row ${isOpen ? "active" : ""}`} key={report.id}>
                        <button
                          className="report-summary"
                          onClick={() => setActiveReportId(report.id)}
                          type="button"
                        >
                          <strong>{report.title}</strong>
                          <span>{task?.title || p.tester.deletedTask}</span>
                        </button>
                      </article>
                    );
                  })}
                </div>

                {activeReport && (
                  <article className="report-viewer-detail">
                    <h3>
                      {state.tasks.find((item) => item.id === activeReport.taskId)?.title ||
                        p.tester.deletedTask}
                    </h3>
                    <div className="cv-section">
                      <h3>{p.tester.submittedAt}</h3>
                      <p>{formatDeadline(activeReport.createdAt)}</p>
                    </div>
                    <div className="cv-section">
                      <h3>{p.tester.foundAt}</h3>
                      <p>{activeReport.location || p.tester.notSpecified}</p>
                    </div>
                    <div className="cv-section">
                      <h3>{p.tester.bugDetails}</h3>
                      <p>{activeReport.vulnerability || p.tester.noDetails}</p>
                    </div>
                    <div className="cv-section">
                      <h3>{p.tester.suggestedFix}</h3>
                      <p>{activeReport.fix || p.tester.noFix}</p>
                    </div>
                  </article>
                )}
              </div>
            )}
          </div>
        ) : isMessagesView ? (
          <MessagesPanel
            currentUser={currentUser}
            onSendMessage={onSendMessage}
            state={state}
            t={t}
          />
        ) : isPaymentsView ? (
          <PaymentsPanel
            title={p.tester.paymentsTitle}
            subtitle={p.tester.paymentsSubtitle}
            metrics={[
              [p.tester.earned, money(earnedTotal)],
              [p.tester.pendingPayout, money(pendingTotal)],
              [p.tester.paidTasks, testerPayments.filter((row) => row.application.paid).length],
              [p.tester.selectedTasks, testerPayments.length],
            ]}
            rows={testerPayments.map((row) => ({
              amount: money(row.payout),
              detail: row.application.paid
                ? p.tester.paidToBalance
                : row.application.completed
                  ? p.tester.readyForPayment
                  : p.tester.testingInProgress,
              status: row.application.paid
                ? p.status.paid
                : row.application.completed
                  ? p.status.awaitingPayment
                  : p.status.pending,
              title: row.task.title,
            }))}
            emptyLabel={p.payments.noRecords}
          />
        ) : (
          <>
        <div className="tester-board-heading">
          <div>
            <h1>{isMyTasksView ? p.tester.selectedTasksTitle : p.tester.availableTasks}</h1>
            <p>
              {isMyTasksView
                ? p.tester.selectedSubtitle
                : p.tester.availableSubtitle}
            </p>
          </div>
          <div className="tester-metrics">
            <Metric value={visibleTasks.length} label={isMyTasksView ? p.status.selected : p.tester.available} />
            <Metric value={appliedCount} label={p.tester.applied} />
            <Metric value={inProgressCount} label={p.tester.inProgress} />
            <Metric value={completedCount} label={p.tester.completed} />
          </div>
        </div>

        <div className="tester-filter-row">
          <label className="search-box tester-search-wide">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder={p.tester.searchPlaceholder}
            />
          </label>
          <button className="secondary-button" type="button">{p.tester.allCategories}</button>
          <button className="secondary-button" type="button">{p.tester.allPlatforms}</button>
          <button className="secondary-button" type="button">{p.tester.budget}</button>
          <button className="secondary-button" type="button">
            <SlidersHorizontal size={17} /> {p.tester.filters}
          </button>
          <select className="sort-select" aria-label="Sort tasks">
            <option>{p.tester.newestFirst}</option>
            <option>{p.tester.highestPayout}</option>
            <option>{p.tester.closestDeadline}</option>
          </select>
        </div>

        <div className="tester-task-list">
          {visibleTasks.length === 0 && (
            <p className="empty-state">
              {isMyTasksView
                ? p.tester.notSelectedYet
                : p.tester.noTasksFound}
            </p>
          )}
          {visibleTasks.map((task) => {
            const applied = state.applications.find(
              (item) => item.taskId === task.id && item.testerId === currentUser.id,
            );
            const client = state.users.find((user) => user.id === task.clientId);
            const isFull = selectedTesterIds(task).length >= taskSlots(task);
            return (
              <article
                className="tester-task-row clickable"
                key={task.id}
                onClick={() => onViewTask(task.id)}
              >
                <div className={`product-icon ${productKey(task.product)}`}>
                  {productLabel(task.product)}
                </div>

                <div className="tester-task-main">
                  <div className="tester-task-title">
                    <h2>{task.title}</h2>
                    <span className={`status ${task.status}`}>
                      {task.status === "assigned"
                        ? p.status.assigned
                        : task.status === "closed"
                          ? p.status.closed
                          : p.status.new}
                    </span>
                  </div>
                  <p>{task.description || p.tester.noDescription}</p>
                  <div className="task-chip-row">
                    <span>{task.product || p.tester.product}</span>
                    {task.expected && <span>{p.tester.bugReporting}</span>}
                    <span>{client?.name || p.tester.client}</span>
                  </div>
                </div>

                <div className="tester-task-facts">
                  <span><Wallet size={17} /> {p.tester.budgetPerTester} <strong>{money(taskPayout(task))}</strong></span>
                  <span><UsersRound size={17} /> {p.tester.places} <strong>{taskSlots(task)}</strong></span>
                  <span><Calendar size={17} /> {p.tester.deadline} <strong>{formatDeadline(task.deadline)}</strong></span>
                </div>

                <div className="tester-task-actions">
                  <button
                    className="secondary-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onViewTask(task.id);
                    }}
                    type="button"
                  >
                    <Eye size={17} /> {p.tester.viewDetails}
                  </button>
                  {applied?.status === "selected" && (
                    <button
                      className="start-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onStartTask(task.id);
                      }}
                      type="button"
                    >
                      <Play size={17} /> {p.tester.start}
                    </button>
                  )}
                </div>

                {!applied && !isMyTasksView && task.status !== "closed" && !isFull && (
                  <div className="tester-apply-row">
                    <input
                      onClick={(event) => event.stopPropagation()}
                      value={applicationText[task.id] || ""}
                      onChange={(event) =>
                        onTextChange({
                          ...applicationText,
                          [task.id]: event.target.value,
                        })
                      }
                      placeholder={p.tester.applyPlaceholder}
                    />
                    <button
                      className="primary-button small"
                      onClick={(event) => {
                        event.stopPropagation();
                        onApply(task.id);
                      }}
                      type="button"
                    >
                      <Send size={17} /> {p.tester.apply}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
          </>
        )}
      </section>
    </div>
  );
}

export function ClientDashboard({
  currentUser,
  onChooseTester,
  onCreateTask,
  onDeleteTask,
  onOpenProfile,
  onOpenSettings,
  onSendMessage,
  onToggleTaskHiring,
  onViewApplications,
  onViewProfile,
  onViewTask,
  onTaskFormChange,
  state,
  t,
  taskForm,
}) {
  const p = t.platform;
  const [createOpen, setCreateOpen] = useState(false);
  const [openActionTaskId, setOpenActionTaskId] = useState("");
  const [clientSection, setClientSection] = useState("tasks");
  const myTasks = state.tasks.filter((task) => task.clientId === currentUser.id);
  const applicationCount = state.applications.filter((item) =>
    myTasks.some((task) => task.id === item.taskId),
  ).length;
  const clientApplications = state.applications
    .map((application) => {
      const task = myTasks.find((item) => item.id === application.taskId);
      const tester = state.users.find((user) => user.id === application.testerId);
      return task && tester ? { application, task, tester } : null;
    })
    .filter(Boolean);
  const clientPayments = clientPaymentRows(myTasks, state.applications);
  const totalBudget = myTasks.reduce((sum, task) => sum + (Number(task.budget) || 0), 0);
  const totalPaid = clientPayments.reduce((sum, row) => sum + row.paid, 0);
  const totalReserved = clientPayments.reduce((sum, row) => sum + row.reserved, 0);
  const totalRemaining = clientPayments.reduce((sum, row) => sum + row.remaining, 0);

  function handleCreateTask(event) {
    onCreateTask(event);
    setCreateOpen(false);
  }

  return (
    <div className="client-dashboard">
      <aside className="client-page-sidebar">
        <button
          className="primary-button create-task-button"
          onClick={() => setCreateOpen(true)}
          type="button"
        >
          <Plus size={18} /> {p.client.newTask}
        </button>
        <nav className="applications-nav">
          <button
            className={clientSection === "tasks" ? "active" : ""}
            onClick={() => setClientSection("tasks")}
            type="button"
          >
            <BriefcaseBusiness size={17} /> {p.client.myTasks}
          </button>
          <button
            className={clientSection === "applications" ? "active" : ""}
            onClick={() => setClientSection("applications")}
            type="button"
          >
            <UsersRound size={17} /> {p.nav.applications}
          </button>
          <button type="button">
            <FileTextIcon /> {p.nav.reports}
          </button>
          <button
            className={clientSection === "payments" ? "active" : ""}
            onClick={() => setClientSection("payments")}
            type="button"
          >
            <Wallet size={17} /> {p.nav.payments}
          </button>
          <button
            className={clientSection === "messages" ? "active" : ""}
            onClick={() => setClientSection("messages")}
            type="button"
          >
            <MessageSquare size={17} /> {p.nav.messages}
          </button>
          <button onClick={() => onOpenProfile(currentUser.id)} type="button">
            <UserRound size={17} /> {p.nav.profile}
          </button>
          <button onClick={onOpenSettings} type="button">
            <Settings size={17} /> {p.nav.settings}
          </button>
        </nav>
      </aside>
      <section className="client-main-panel">
        {clientSection === "applications" ? (
          <ClientApplicationsPanel
            applications={clientApplications}
            onViewApplications={onViewApplications}
            onViewProfile={onViewProfile}
            t={t}
          />
        ) : clientSection === "messages" ? (
          <MessagesPanel
            currentUser={currentUser}
            onSendMessage={onSendMessage}
            state={state}
            t={t}
          />
        ) : clientSection === "payments" ? (
          <PaymentsPanel
            title={p.client.paymentsTitle}
            subtitle={p.client.paymentsSubtitle}
            metrics={[
              [p.client.totalBudget, money(totalBudget)],
              [p.client.paid, money(totalPaid)],
              [p.client.reservedUnpaid, money(totalReserved)],
              [p.client.remainingBalance, money(totalRemaining)],
            ]}
            rows={clientPayments.map((row) => ({
              amount: money(row.task.budget),
              detail: `${row.selectedCount} ${p.client.selectedPaid} · ${row.paidCount} ${p.client.paidCount} · ${money(row.payout)} ${p.client.perTester}`,
              status: `${money(row.remaining)} ${p.client.left}`,
              title: row.task.title,
            }))}
            emptyLabel={p.payments.noRecords}
          />
        ) : (
          <>
        <div className="client-toolbar">
          <h1>{p.client.heading}</h1>

          <div className="client-toolbar-actions">
            <div className="stats-row compact-stats">
              <Metric value={myTasks.length} label={p.client.tasks} />
              <Metric value={applicationCount} label={p.client.applications} />
            </div>
            <button className="secondary-button small filter-control" type="button">
              <SlidersHorizontal size={17} /> {p.tester.filters}
            </button>
          </div>
        </div>

        <div className="client-task-grid">
          {myTasks.length === 0 && (
            <p className="empty-state client-empty-state">
              {p.client.noTasks}
            </p>
          )}
          {myTasks.map((task) => {
            const applications = state.applications.filter(
              (item) => item.taskId === task.id,
            );
            const selectedIds = selectedTesterIds(task);
            const selected = selectedIds
              .map((testerId) => state.users.find((user) => user.id === testerId))
              .filter(Boolean);
            return (
              <article
                className="task-card client-task-card clickable"
                key={task.id}
                onClick={() => onViewTask(task.id)}
              >
                <button
                  className={`card-menu-button ${
                    openActionTaskId === task.id ? "active" : ""
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenActionTaskId(openActionTaskId === task.id ? "" : task.id);
                  }}
                  type="button"
                  title={p.client.taskActions}
                >
                  <MoreHorizontal size={19} />
                </button>
                {openActionTaskId === task.id && (
                  <div className="task-action-menu" onClick={(event) => event.stopPropagation()}>
                    <button
                      onClick={() => {
                        onToggleTaskHiring(task.id);
                        setOpenActionTaskId("");
                      }}
                      type="button"
                    >
                      {task.status === "closed" ? (
                        <>
                          <Play size={16} /> {p.client.reopenHiring}
                        </>
                      ) : (
                        <>
                          <Pause size={16} /> {p.client.stopHiring}
                        </>
                      )}
                    </button>
                    <button
                      className="danger"
                      onClick={() => {
                        onDeleteTask(task.id);
                        setOpenActionTaskId("");
                      }}
                      type="button"
                    >
                      <Trash2 size={16} /> {p.client.deleteTask}
                    </button>
                  </div>
                )}

                <div className="client-task-body">
                  <span className={`status ${task.status}`}>
                    {task.status === "assigned"
                      ? p.status.assigned
                      : task.status === "closed"
                        ? p.status.closed
                        : p.status.open}
                  </span>
                  <h2>{task.title}</h2>
                  <p className="task-product">{task.product}</p>
                  <p className="task-text">{task.description}</p>

                  <div className="client-task-meta">
                    <span>
                      <small>{p.tester.places}</small>
                      <strong>{selectedIds.length}/{taskSlots(task)}</strong>
                    </span>
                    <span>
                      <small>{p.client.payoutPerTester}</small>
                      <strong>{money(taskPayout(task))}</strong>
                    </span>
                    <span>
                      <small>{p.client.deadline}</small>
                      <strong>{formatDeadline(task.deadline)}</strong>
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <strong className="client-task-budget">{money(task.budget)}</strong>
                  <button
                    className="secondary-button small"
                    onClick={(event) => {
                      event.stopPropagation();
                      onViewTask(task.id);
                    }}
                    type="button"
                  >
                    <Eye size={17} /> {p.client.viewTask}
                  </button>
                  <button
                    className="secondary-button small"
                    onClick={(event) => {
                      event.stopPropagation();
                      onViewApplications(task.id);
                    }}
                    type="button"
                  >
                    <UsersRound size={17} /> {p.nav.applications}
                  </button>
                </div>

                {selected.length > 0 && (
                  <div className="selected-banner">
                    <Check size={18} /> {p.client.selectedTesters}{" "}
                    {selected.map((tester) => tester.name).join(", ")}
                  </div>
                )}
                <p className="application-summary">
                  {applications.length} {p.client.application} {p.client.submitted}
                </p>
              </article>
            );
          })}
        </div>
          </>
        )}
      </section>

      {createOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="settings-modal create-task-modal" role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <span className="step-pill">{p.client.newTask}</span>
                <h2>{p.client.createTask}</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setCreateOpen(false)}
                title={p.settings.close}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <form className="form settings-form" onSubmit={handleCreateTask}>
              <div className="form-grid">
                <label>
                  {p.client.title}
                  <input
                    value={taskForm.title}
                    onChange={(event) =>
                      onTaskFormChange({ ...taskForm, title: event.target.value })
                    }
                    placeholder={p.client.titlePlaceholder}
                  />
                </label>
                <label>
                  {p.client.budgetAed}
                  <input
                    value={taskForm.budget}
                    onChange={(event) =>
                      onTaskFormChange({ ...taskForm, budget: event.target.value })
                    }
                    placeholder={p.client.budgetPlaceholder}
                  />
                </label>
                <label>
                  {p.client.product}
                  <select
                    value={taskForm.product}
                    onChange={(event) =>
                      onTaskFormChange({ ...taskForm, product: event.target.value })
                    }
                  >
                    <option value="">{p.client.selectProduct}</option>
                    {PRODUCT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {p.client.testerPlaces}
                  <input
                    value={taskForm.slots}
                    onChange={(event) =>
                      onTaskFormChange({ ...taskForm, slots: event.target.value })
                    }
                    placeholder={p.client.placesPlaceholder}
                  />
                </label>
              </div>
              <label>
                {p.client.description}
                <textarea
                  value={taskForm.description}
                  onChange={(event) =>
                    onTaskFormChange({ ...taskForm, description: event.target.value })
                  }
                  placeholder={p.client.descriptionPlaceholder}
                />
              </label>
              <div className="form-grid">
                <label>
                  {p.client.expected}
                  <textarea
                    value={taskForm.expected}
                    onChange={(event) =>
                      onTaskFormChange({ ...taskForm, expected: event.target.value })
                    }
                    placeholder={p.client.expectedPlaceholder}
                  />
                </label>
                <label>
                  {p.client.deadline}
                  <input
                    value={taskForm.deadline}
                    onChange={(event) =>
                      onTaskFormChange({ ...taskForm, deadline: event.target.value })
                    }
                    type="datetime-local"
                  />
                </label>
              </div>
              <label>
                {p.client.privateLink}
                <input
                  value={taskForm.privateLink}
                  onChange={(event) =>
                    onTaskFormChange({ ...taskForm, privateLink: event.target.value })
                  }
                  placeholder="https://example.com/test-build"
                />
              </label>

              <div className="modal-actions">
                <button
                  className="secondary-button"
                  onClick={() => setCreateOpen(false)}
                  type="button"
                >
                  {p.client.cancel}
                </button>
                <button className="primary-button" type="submit">
                  <Plus size={18} /> {p.client.create}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function FileTextIcon() {
  return <ClipboardList size={17} />;
}

function ClientApplicationsPanel({ applications, onViewApplications, onViewProfile, t }) {
  const p = t.platform;

  return (
    <div className="client-applications-panel">
      <div className="tester-board-heading">
        <div>
          <h1>{p.client.allApplicationsTitle}</h1>
          <p>{p.client.allApplicationsSubtitle}</p>
        </div>
        <div className="tester-metrics">
          <Metric value={applications.length} label={p.nav.applications} />
          <Metric
            value={applications.filter(({ application }) => application.status === "selected").length}
            label={p.status.selected}
          />
        </div>
      </div>

      {applications.length === 0 ? (
        <p className="empty-state">{p.client.noApplications}</p>
      ) : (
        <div className="client-application-list">
          {applications.map(({ application, task, tester }) => (
            <article className="client-application-row" key={application.id}>
              <div className="applicant-profile-head">
                <span className="avatar">{initials(tester.name || tester.login || "QA")}</span>
                <div>
                  <button
                    className="profile-name-link"
                    onClick={() => onViewProfile(tester.id)}
                    type="button"
                  >
                    {tester.name || tester.login}
                  </button>
                  <p>{tester.skills || p.task.qaTester}</p>
                </div>
              </div>

              <div className="client-application-task">
                <span>{task.title}</span>
                <strong>{task.product || p.task.product}</strong>
              </div>

              <div className="client-application-message">
                <span>{p.client.applicantMessage}</span>
                <p>{application.message || p.task.noDetails}</p>
              </div>

              <span className={`application-badge ${application.status === "selected" ? "selected" : ""}`}>
                {application.status === "selected" ? p.status.selected : p.status.applied}
              </span>

              <div className="client-application-actions">
                <button
                  className="secondary-button small"
                  onClick={() => onViewProfile(tester.id)}
                  type="button"
                >
                  <UserRound size={16} /> {p.client.viewProfile}
                </button>
                <button
                  className="secondary-button small"
                  onClick={() => onViewApplications(task.id)}
                  type="button"
                >
                  <UsersRound size={16} /> {p.client.viewApplications}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function MessagesPanel({ currentUser, onSendMessage, state, t }) {
  const p = t.platform.messages;
  const [activeUserId, setActiveUserId] = useState("");
  const [draft, setDraft] = useState("");
  const myMessages = useMemo(
    () =>
      [...(state.messages || [])]
        .filter(
          (message) =>
            message.fromId === currentUser.id || message.toId === currentUser.id,
        )
        .sort((first, second) => new Date(first.createdAt) - new Date(second.createdAt)),
    [currentUser.id, state.messages],
  );
  const conversations = useMemo(() => {
    const map = new Map();
    myMessages.forEach((message) => {
      const otherUserId =
        message.fromId === currentUser.id ? message.toId : message.fromId;
      const otherUser = state.users.find((user) => user.id === otherUserId);
      if (!otherUser) return;
      map.set(otherUserId, {
        lastMessage: message,
        user: otherUser,
      });
    });
    return [...map.values()].sort(
      (first, second) =>
        new Date(second.lastMessage.createdAt) -
        new Date(first.lastMessage.createdAt),
    );
  }, [currentUser.id, myMessages, state.users]);
  const activeConversation =
    conversations.find((item) => item.user.id === activeUserId) ||
    conversations[0];
  const activeMessages = activeConversation
    ? myMessages.filter(
        (message) =>
          message.fromId === activeConversation.user.id ||
          message.toId === activeConversation.user.id,
      )
    : [];

  React.useEffect(() => {
    if (!activeConversation) {
      if (activeUserId) setActiveUserId("");
      return;
    }
    if (activeUserId !== activeConversation.user.id) {
      setActiveUserId(activeConversation.user.id);
    }
  }, [activeConversation, activeUserId]);

  function handleSend(event) {
    event.preventDefault();
    if (!activeConversation || !draft.trim()) return;
    onSendMessage(activeConversation.user.id, draft);
    setDraft("");
  }

  return (
    <div className="messages-panel">
      <div className="tester-board-heading">
        <div>
          <h1>{p.title}</h1>
          <p>{p.subtitle}</p>
        </div>
        <MessageSquare size={34} />
      </div>

      {conversations.length === 0 ? (
        <p className="empty-state">{p.empty}</p>
      ) : (
        <div className="messages-layout">
          <aside className="conversation-list">
            {conversations.map(({ lastMessage, user }) => (
              <button
                className={activeConversation?.user.id === user.id ? "active" : ""}
                key={user.id}
                onClick={() => setActiveUserId(user.id)}
                type="button"
              >
                <span className="avatar mini">{user.name ? user.name[0] : "U"}</span>
                <span>
                  <strong>{user.name || user.login}</strong>
                  <em>{lastMessage.text}</em>
                </span>
              </button>
            ))}
          </aside>

          <section className="conversation-thread">
            {activeConversation ? (
              <>
                <div className="conversation-header">
                  <span className="avatar">{activeConversation.user.name ? activeConversation.user.name[0] : "U"}</span>
                  <div>
                    <h2>{activeConversation.user.name || activeConversation.user.login}</h2>
                    <p>{activeConversation.user.role === "tester" ? t.common.tester : t.common.client}</p>
                  </div>
                </div>

                <div className="message-list">
                  {activeMessages.map((message) => {
                    const isMine = message.fromId === currentUser.id;
                    return (
                      <article className={`message-bubble ${isMine ? "mine" : ""}`} key={message.id}>
                        <strong>{isMine ? p.you : activeConversation.user.name}</strong>
                        <p>{message.text}</p>
                        <span>{formatDeadline(message.createdAt)}</span>
                      </article>
                    );
                  })}
                </div>

                <form className="message-compose-row" onSubmit={handleSend}>
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={p.writePlaceholder}
                  />
                  <button className="primary-button small" type="submit">
                    <Send size={17} /> {p.send}
                  </button>
                </form>
              </>
            ) : (
              <p className="empty-state">{p.noConversation}</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function PaymentsPanel({ emptyLabel, metrics, rows, subtitle, title }) {
  return (
    <div className="payments-panel">
      <div className="payments-heading">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <Wallet size={34} />
      </div>

      <div className="payments-metrics">
        {metrics.map(([label, value]) => (
          <div className="payment-metric" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="payments-table">
        {rows.length === 0 ? (
          <p className="empty-state">{emptyLabel}</p>
        ) : (
          rows.map((row) => (
            <article className="payment-row" key={row.title}>
              <div>
                <strong>{row.title}</strong>
                <span>{row.detail}</span>
              </div>
              <em>{row.status}</em>
              <b>{row.amount}</b>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
