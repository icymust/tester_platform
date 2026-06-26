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
  onStartTask,
  onViewTask,
  onSearch,
  onTextChange,
  onViewChange,
  search,
  state,
  view,
}) {
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
            <ClipboardList size={17} /> All tasks
          </button>
          <button
            className={view === "my-tasks" ? "active" : ""}
            onClick={() => onViewChange("my-tasks")}
            type="button"
          >
            <ListChecks size={17} /> My tasks
          </button>
          <button type="button">
            <BriefcaseBusiness size={17} /> Applications
          </button>
          <button
            className={isReportsView ? "active" : ""}
            onClick={() => onViewChange("reports")}
            type="button"
          >
            <BarChart3 size={17} /> Reports
          </button>
          <button
            className={isPaymentsView ? "active" : ""}
            onClick={() => onViewChange("payments")}
            type="button"
          >
            <Wallet size={17} /> Payments
          </button>
          <button type="button">
            <MessageSquare size={17} /> Messages
          </button>
          <button type="button">
            <UserRound size={17} /> Profile
          </button>
          <button type="button">
            <Settings size={17} /> Settings
          </button>
        </nav>
      </aside>

      <section className="tester-main-panel">
        {isReportsView ? (
          <div>
            <div className="tester-board-heading">
              <div>
                <h1>My reports</h1>
                <p>All bug reports you have submitted across tasks.</p>
              </div>
              <div className="tester-metrics">
                <Metric value={myReports.length} label="Reports" />
                <Metric value={reportedTaskIds.size} label="Tasks covered" />
                <Metric value={myReports.filter((report) => report.location).length} label="With location" />
                <Metric value={myReports.filter((report) => report.fix).length} label="With fix" />
              </div>
            </div>

            {myReports.length === 0 ? (
              <p className="empty-state">You have not submitted any reports yet.</p>
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
                          <span>{task?.title || "Deleted task"}</span>
                        </button>
                      </article>
                    );
                  })}
                </div>

                {activeReport && (
                  <article className="report-viewer-detail">
                    <h3>
                      {state.tasks.find((item) => item.id === activeReport.taskId)?.title ||
                        "Deleted task"}
                    </h3>
                    <div className="cv-section">
                      <h3>Submitted at</h3>
                      <p>{formatDeadline(activeReport.createdAt)}</p>
                    </div>
                    <div className="cv-section">
                      <h3>Found at</h3>
                      <p>{activeReport.location || "Not specified"}</p>
                    </div>
                    <div className="cv-section">
                      <h3>Vulnerability / bug details</h3>
                      <p>{activeReport.vulnerability || "No details provided."}</p>
                    </div>
                    <div className="cv-section">
                      <h3>Suggested fix</h3>
                      <p>{activeReport.fix || "No fix suggested."}</p>
                    </div>
                  </article>
                )}
              </div>
            )}
          </div>
        ) : isPaymentsView ? (
          <PaymentsPanel
            title="Tester payments"
            subtitle="Track what you earned and what is still waiting for client payment."
            metrics={[
              ["Earned", money(earnedTotal)],
              ["Pending payout", money(pendingTotal)],
              ["Paid tasks", testerPayments.filter((row) => row.application.paid).length],
              ["Selected tasks", testerPayments.length],
            ]}
            rows={testerPayments.map((row) => ({
              amount: money(row.payout),
              detail: row.application.paid
                ? "Paid to your balance"
                : row.application.completed
                  ? "Ready for payment"
                  : "Testing in progress",
              status: row.application.paid
                ? "Paid"
                : row.application.completed
                  ? "Awaiting payment"
                  : "Pending",
              title: row.task.title,
            }))}
          />
        ) : (
          <>
        <div className="tester-board-heading">
          <div>
            <h1>{isMyTasksView ? "My tasks" : "Available tasks"}</h1>
            <p>
              {isMyTasksView
                ? "Tasks where the client selected you"
                : "Browse and apply to tasks that match your skills"}
            </p>
          </div>
          <div className="tester-metrics">
            <Metric value={visibleTasks.length} label={isMyTasksView ? "Selected" : "Available"} />
            <Metric value={appliedCount} label="Applied" />
            <Metric value={inProgressCount} label="In progress" />
            <Metric value={completedCount} label="Completed" />
          </div>
        </div>

        <div className="tester-filter-row">
          <label className="search-box tester-search-wide">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search tasks by name or keyword..."
            />
          </label>
          <button className="secondary-button" type="button">All categories</button>
          <button className="secondary-button" type="button">All platforms</button>
          <button className="secondary-button" type="button">Budget</button>
          <button className="secondary-button" type="button">
            <SlidersHorizontal size={17} /> Filters
          </button>
          <select className="sort-select" aria-label="Sort tasks">
            <option>Newest first</option>
            <option>Highest payout</option>
            <option>Closest deadline</option>
          </select>
        </div>

        <div className="tester-task-list">
          {visibleTasks.length === 0 && (
            <p className="empty-state">
              {isMyTasksView
                ? "You have not been selected for any tasks yet."
                : "No tasks found."}
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
                        ? "Assigned"
                        : task.status === "closed"
                          ? "Hiring closed"
                          : "New"}
                    </span>
                  </div>
                  <p>{task.description || "No description provided."}</p>
                  <div className="task-chip-row">
                    <span>{task.product || "Product"}</span>
                    {task.expected && <span>Bug Reporting</span>}
                    <span>{client?.name || "Client"}</span>
                  </div>
                </div>

                <div className="tester-task-facts">
                  <span><Wallet size={17} /> Budget per tester <strong>{money(taskPayout(task))}</strong></span>
                  <span><UsersRound size={17} /> Places <strong>{taskSlots(task)}</strong></span>
                  <span><Calendar size={17} /> Deadline <strong>{formatDeadline(task.deadline)}</strong></span>
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
                    <Eye size={17} /> View details
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
                      <Play size={17} /> Start
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
                      placeholder="Briefly explain why you are a good fit"
                    />
                    <button
                      className="primary-button small"
                      onClick={(event) => {
                        event.stopPropagation();
                        onApply(task.id);
                      }}
                      type="button"
                    >
                      <Send size={17} /> Apply
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
  onToggleTaskHiring,
  onViewApplications,
  onViewTask,
  onTaskFormChange,
  state,
  taskForm,
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [openActionTaskId, setOpenActionTaskId] = useState("");
  const [clientSection, setClientSection] = useState("tasks");
  const myTasks = state.tasks.filter((task) => task.clientId === currentUser.id);
  const applicationCount = state.applications.filter((item) =>
    myTasks.some((task) => task.id === item.taskId),
  ).length;
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
          <Plus size={18} /> New task
        </button>
        <nav className="applications-nav">
          <button
            className={clientSection === "tasks" ? "active" : ""}
            onClick={() => setClientSection("tasks")}
            type="button"
          >
            <BriefcaseBusiness size={17} /> My tasks
          </button>
          <button type="button">
            <UsersRound size={17} /> Applications
          </button>
          <button type="button">
            <FileTextIcon /> Reports
          </button>
          <button
            className={clientSection === "payments" ? "active" : ""}
            onClick={() => setClientSection("payments")}
            type="button"
          >
            <Wallet size={17} /> Payments
          </button>
          <button type="button">
            <MessageSquare size={17} /> Messages
          </button>
          <button type="button">
            <Settings size={17} /> Settings
          </button>
        </nav>
      </aside>
      <section className="client-main-panel">
        {clientSection === "payments" ? (
          <PaymentsPanel
            title="Client payments"
            subtitle="Track task budgets, paid testers, and remaining balance."
            metrics={[
              ["Total budget", money(totalBudget)],
              ["Paid", money(totalPaid)],
              ["Reserved unpaid", money(totalReserved)],
              ["Remaining balance", money(totalRemaining)],
            ]}
            rows={clientPayments.map((row) => ({
              amount: money(row.task.budget),
              detail: `${row.selectedCount} selected · ${row.paidCount} paid · ${money(row.payout)} per tester`,
              status: `${money(row.remaining)} left`,
              title: row.task.title,
            }))}
          />
        ) : (
          <>
        <div className="client-toolbar">
          <h1>My tasks and applications</h1>

          <div className="client-toolbar-actions">
            <div className="stats-row compact-stats">
              <Metric value={myTasks.length} label="tasks" />
              <Metric value={applicationCount} label="applications" />
            </div>
            <button className="secondary-button small filter-control" type="button">
              <SlidersHorizontal size={17} /> Filters
            </button>
          </div>
        </div>

        <div className="client-task-grid">
          {myTasks.length === 0 && (
            <p className="empty-state client-empty-state">
              No tasks yet. Create your first beta testing task.
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
                  title="Task actions"
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
                          <Play size={16} /> Reopen hiring
                        </>
                      ) : (
                        <>
                          <Pause size={16} /> Stop hiring
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
                      <Trash2 size={16} /> Delete task
                    </button>
                  </div>
                )}

                <div className="client-task-body">
                  <span className={`status ${task.status}`}>
                    {task.status === "assigned"
                      ? "Assigned"
                      : task.status === "closed"
                        ? "Hiring closed"
                        : "Open"}
                  </span>
                  <h2>{task.title}</h2>
                  <p className="task-product">{task.product}</p>
                  <p className="task-text">{task.description}</p>

                  <div className="client-task-meta">
                    <span>
                      <small>Places</small>
                      <strong>{selectedIds.length}/{taskSlots(task)}</strong>
                    </span>
                    <span>
                      <small>Payout per tester</small>
                      <strong>{money(taskPayout(task))}</strong>
                    </span>
                    <span>
                      <small>Deadline</small>
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
                    <Eye size={17} /> View task
                  </button>
                  <button
                    className="secondary-button small"
                    onClick={(event) => {
                      event.stopPropagation();
                      onViewApplications(task.id);
                    }}
                    type="button"
                  >
                    <UsersRound size={17} /> Applications
                  </button>
                </div>

                {selected.length > 0 && (
                  <div className="selected-banner">
                    <Check size={18} /> Selected testers:{" "}
                    {selected.map((tester) => tester.name).join(", ")}
                  </div>
                )}
                <p className="application-summary">
                  {applications.length} application
                  {applications.length === 1 ? "" : "s"} submitted
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
                <span className="step-pill">New task</span>
                <h2>Create new task</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setCreateOpen(false)}
                title="Close"
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <form className="form settings-form" onSubmit={handleCreateTask}>
              <div className="form-grid">
                <label>
                  Title
                  <input
                    value={taskForm.title}
                    onChange={(event) =>
                      onTaskFormChange({ ...taskForm, title: event.target.value })
                    }
                    placeholder="Enter task title"
                  />
                </label>
                <label>
                  Budget, AED
                  <input
                    value={taskForm.budget}
                    onChange={(event) =>
                      onTaskFormChange({ ...taskForm, budget: event.target.value })
                    }
                    placeholder="Enter budget"
                  />
                </label>
                <label>
                  Product
                  <select
                    value={taskForm.product}
                    onChange={(event) =>
                      onTaskFormChange({ ...taskForm, product: event.target.value })
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
                <label>
                  Tester places
                  <input
                    value={taskForm.slots}
                    onChange={(event) =>
                      onTaskFormChange({ ...taskForm, slots: event.target.value })
                    }
                    placeholder="Enter number of places"
                  />
                </label>
              </div>
              <label>
                Description
                <textarea
                  value={taskForm.description}
                  onChange={(event) =>
                    onTaskFormChange({ ...taskForm, description: event.target.value })
                  }
                  placeholder="Describe what should be tested"
                />
              </label>
              <div className="form-grid">
                <label>
                  Expected deliverables
                  <textarea
                    value={taskForm.expected}
                    onChange={(event) =>
                      onTaskFormChange({ ...taskForm, expected: event.target.value })
                    }
                    placeholder="What should testers deliver?"
                  />
                </label>
                <label>
                  Deadline
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
                Private work link
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
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  <Plus size={18} /> Create task
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

function PaymentsPanel({ metrics, rows, subtitle, title }) {
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
          <p className="empty-state">No payment records yet.</p>
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
