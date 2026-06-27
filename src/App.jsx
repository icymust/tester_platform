import React, { useEffect, useState } from "react";
import { AppHeader } from "./components/AppHeader.jsx";
import { AuthScreen } from "./components/AuthScreen.jsx";
import { LandingPage } from "./components/LandingPage.jsx";
import {
  AccountSettingsModal,
  ClientDashboard,
  OnboardingProfile,
  ProfilePage,
  TaskDetailsModal,
  TesterDashboard,
  TesterWorkspaceModal,
} from "./components/PlatformComponents.jsx";
import {
  clearSession,
  getRoutePath,
  loadSession,
  loadState,
  profileIdFromPath,
  saveSession,
  saveState,
  selectedTesterIds,
  taskSlots,
} from "./lib/platform.js";
import { getLanguageMeta, translations } from "./lib/i18n.js";

function App() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("betahub_language") || "en",
  );
  const [state, setState] = useState(loadState);
  const [routePath, setRoutePath] = useState(getRoutePath);
  const [currentUserId, setCurrentUserId] = useState(loadSession);
  const [authMode, setAuthMode] = useState("login");
  const [role, setRole] = useState("");
  const [authForm, setAuthForm] = useState({
    name: "",
    login: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");
  const [taskForm, setTaskForm] = useState({
    title: "",
    product: "",
    description: "",
    expected: "",
    budget: "",
    slots: "1",
    deadline: "",
    privateLink: "",
  });
  const [profileForm, setProfileForm] = useState({
    experience: "",
    skills: "",
    education: "",
    certificates: "",
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    login: "",
    password: "",
    experience: "",
    skills: "",
    education: "",
    certificates: "",
  });
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [taskDetailsMode, setTaskDetailsMode] = useState("view");
  const [taskEditForm, setTaskEditForm] = useState({
    title: "",
    product: "",
    description: "",
    expected: "",
    budget: "",
    slots: "1",
    deadline: "",
    privateLink: "",
  });
  const [applicationText, setApplicationText] = useState({});
  const [search, setSearch] = useState("");
  const [testerView, setTesterView] = useState("available");
  const [workspaceTaskId, setWorkspaceTaskId] = useState("");
  const [reportForm, setReportForm] = useState({
    title: "",
    location: "",
    vulnerability: "",
    fix: "",
  });
  const [reportFormOpen, setReportFormOpen] = useState(false);
  const [messageRecipientId, setMessageRecipientId] = useState("");
  const [messageDraft, setMessageDraft] = useState("");

  const currentUser = state.users.find((user) => user.id === currentUserId);
  const selectedTask = state.tasks.find((task) => task.id === selectedTaskId);
  const workspaceTask = state.tasks.find((task) => task.id === workspaceTaskId);
  const isOwnProfileRoute = routePath === "/profile" || routePath === "/profile/";
  const routeProfileId = isOwnProfileRoute ? currentUserId : profileIdFromPath(routePath);
  const routeProfile = state.users.find((user) => user.id === routeProfileId);
  const messageRecipient = state.users.find((user) => user.id === messageRecipientId);
  const languageMeta = getLanguageMeta(language);
  const t = translations[language] || translations.en;

  useEffect(() => {
    localStorage.setItem("betahub_language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = languageMeta.dir;
  }, [language, languageMeta.dir]);

  useEffect(() => {
    if (currentUserId && !currentUser) {
      clearSession();
      setCurrentUserId("");
    }
  }, [currentUser, currentUserId]);

  useEffect(() => {
    if (!currentUser) return;

    const isPlatformRoute = routePath === "/platform" || routePath.startsWith("/platform/");
    const isProfileRoute =
      routePath === "/profile" ||
      routePath === "/profile/" ||
      routePath.startsWith("/profiles/");
    if (isPlatformRoute || isProfileRoute) return;

    window.history.replaceState({}, "", "/platform");
    setRoutePath("/platform");
  }, [currentUser, routePath]);

  useEffect(() => {
    function handlePopState() {
      setRoutePath(getRoutePath());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function commit(nextState) {
    setState(nextState);
    saveState(nextState);
  }

  function handleAuth(event) {
    event.preventDefault();
    setAuthError("");

    if (authMode === "login") {
      const found = state.users.find(
        (user) =>
          user.login === authForm.login && user.password === authForm.password,
      );
      if (found) {
        setCurrentUserId(found.id);
        saveSession(found.id);
        setProfileForm({
          experience: found.experience || "",
          skills: found.skills || "",
          education: found.education || "",
          certificates: found.certificates || "",
        });
        window.history.pushState({}, "", "/platform");
        setRoutePath("/platform");
      } else {
        setAuthError(t.errors.accountNotFound);
      }
      return;
    }

    if (!role) {
      setAuthError(t.errors.roleRequired);
      return;
    }

    const login = authForm.login.trim();
    const loginTaken = state.users.some(
      (user) => user.login.toLowerCase() === login.toLowerCase(),
    );
    if (loginTaken) {
      setAuthError(t.errors.usernameTaken);
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      role,
      name: authForm.name || authForm.login || "New user",
      login: login || String(Date.now()),
      password: authForm.password || "1",
      experience: "",
      skills: "",
      education: "",
      certificates: "",
      profileComplete: role === "client",
      company: role === "client" ? authForm.name : "",
    };
    const nextState = { ...state, users: [...state.users, newUser] };
    commit(nextState);
    setCurrentUserId(newUser.id);
    saveSession(newUser.id);
    setProfileForm({ experience: "", skills: "", education: "", certificates: "" });
    window.history.pushState({}, "", "/platform");
    setRoutePath("/platform");
  }

  function updateProfile(event) {
    event.preventDefault();
    const nextUsers = state.users.map((user) =>
      user.id === currentUser.id
        ? { ...user, ...profileForm, profileComplete: true }
        : user,
    );
    commit({ ...state, users: nextUsers });
  }

  function openSettings() {
    setSettingsForm({
      name: currentUser.name || "",
      login: currentUser.login || "",
      password: currentUser.password || "",
      experience: currentUser.experience || "",
      skills: currentUser.skills || "",
      education: currentUser.education || "",
      certificates: currentUser.certificates || "",
    });
    setSettingsOpen(true);
  }

  function saveSettings(event) {
    event.preventDefault();
    const nextUsers = state.users.map((user) =>
      user.id === currentUser.id
        ? {
            ...user,
            ...settingsForm,
            company: user.role === "client" ? settingsForm.name : user.company,
          }
        : user,
    );
    commit({ ...state, users: nextUsers });
    setProfileForm({
      experience: settingsForm.experience,
      skills: settingsForm.skills,
      education: settingsForm.education,
      certificates: settingsForm.certificates,
    });
    setSettingsOpen(false);
  }

  function createTask(event) {
    event.preventDefault();
    const newTask = {
      id: crypto.randomUUID(),
      clientId: currentUser.id,
      ...taskForm,
      status: "open",
      selectedTesterIds: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    commit({ ...state, tasks: [newTask, ...state.tasks] });
    setTaskForm({
      title: "",
      product: "",
      description: "",
      expected: "",
      budget: "",
      slots: "1",
      deadline: "",
      privateLink: "",
    });
  }

  function openTaskDetails(taskId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;

    setSelectedTaskId(taskId);
    setTaskDetailsMode("view");
    setTaskEditForm({
      title: task.title || "",
      product: task.product || "",
      description: task.description || "",
      expected: task.expected || "",
      budget: task.budget || "",
      slots: String(taskSlots(task)),
      deadline: task.deadline || "",
      privateLink: task.privateLink || "",
    });
  }

  function openTaskApplications(taskId) {
    openTaskDetails(taskId);
    setTaskDetailsMode("applications");
  }

  function openTaskReports(taskId) {
    openTaskDetails(taskId);
    setTaskDetailsMode("reports");
  }

  function openTesterWorkspace(taskId) {
    closeTaskDetails();
    setWorkspaceTaskId(taskId);
    setReportFormOpen(false);
    setReportForm({ title: "", location: "", vulnerability: "", fix: "" });
  }

  function closeTesterWorkspace() {
    setWorkspaceTaskId("");
    setReportFormOpen(false);
  }

  function submitBugReport(event) {
    event.preventDefault();
    if (!workspaceTask) return;

    const newReport = {
      id: crypto.randomUUID(),
      taskId: workspaceTask.id,
      testerId: currentUser.id,
      title: reportForm.title || "Untitled bug report",
      location: reportForm.location,
      vulnerability: reportForm.vulnerability,
      fix: reportForm.fix,
      createdAt: new Date().toISOString(),
    };

    commit({
      ...state,
      reports: [newReport, ...(state.reports || [])],
    });
    setReportForm({ title: "", location: "", vulnerability: "", fix: "" });
    setReportFormOpen(false);
  }

  function navigateToProfile(userId) {
    closeTaskDetails();
    const nextPath = `/profiles/${encodeURIComponent(userId)}`;
    window.history.pushState({}, "", nextPath);
    setRoutePath(nextPath);
  }

  function navigateToOwnProfile() {
    closeTaskDetails();
    window.history.pushState({}, "", "/profile");
    setRoutePath("/profile");
  }

  function openMessageModal(userId) {
    if (!userId || userId === currentUser.id) return;
    setMessageRecipientId(userId);
    setMessageDraft("");
  }

  function closeMessageModal() {
    setMessageRecipientId("");
    setMessageDraft("");
  }

  function sendMessage(toId, text) {
    const cleanText = text.trim();
    if (!cleanText || !toId || toId === currentUser.id) return;

    const newMessage = {
      id: crypto.randomUUID(),
      fromId: currentUser.id,
      toId,
      text: cleanText,
      createdAt: new Date().toISOString(),
    };
    commit({ ...state, messages: [newMessage, ...(state.messages || [])] });
  }

  function sendProfileMessage(event) {
    event.preventDefault();
    if (!messageRecipient) return;
    sendMessage(messageRecipient.id, messageDraft);
    closeMessageModal();
  }

  function renderMessageModal() {
    if (!messageRecipient) return null;

    return (
      <div className="modal-backdrop" role="presentation">
        <section className="settings-modal message-compose-modal" role="dialog" aria-modal="true">
          <div className="modal-header">
            <div>
              <span className="step-pill">{t.platform.messages.newMessage}</span>
              <h2>{t.platform.messages.messageTo} {messageRecipient.name}</h2>
            </div>
            <button
              className="icon-button"
              onClick={closeMessageModal}
              title={t.platform.messages.close}
              type="button"
            >
              ×
            </button>
          </div>
          <form className="form settings-form" onSubmit={sendProfileMessage}>
            <label>
              {t.platform.messages.title}
              <textarea
                autoFocus
                value={messageDraft}
                onChange={(event) => setMessageDraft(event.target.value)}
                placeholder={t.platform.messages.writePlaceholder}
              />
            </label>
            <div className="modal-actions">
              <button className="secondary-button" onClick={closeMessageModal} type="button">
                {t.platform.messages.cancel}
              </button>
              <button className="primary-button" type="submit">
                {t.platform.messages.send}
              </button>
            </div>
          </form>
        </section>
      </div>
    );
  }

  function goBackFromProfile() {
    window.history.pushState({}, "", "/");
    setRoutePath("/");
  }

  function closeTaskDetails() {
    setSelectedTaskId("");
    setTaskDetailsMode("view");
  }

  function startTaskEdit() {
    if (!selectedTask) return;
    setTaskEditForm({
      title: selectedTask.title || "",
      product: selectedTask.product || "",
      description: selectedTask.description || "",
      expected: selectedTask.expected || "",
      budget: selectedTask.budget || "",
      slots: String(taskSlots(selectedTask)),
      deadline: selectedTask.deadline || "",
      privateLink: selectedTask.privateLink || "",
    });
    setTaskDetailsMode("edit");
  }

  function saveTaskEdit(event) {
    event.preventDefault();
    const nextTasks = state.tasks.map((task) => {
      if (task.id !== selectedTaskId) return task;

      const nextSlots = taskSlots(taskEditForm);
      const nextSelectedIds = selectedTesterIds(task).slice(0, nextSlots);
      return {
        ...task,
        ...taskEditForm,
        selectedTesterIds: nextSelectedIds,
        selectedTesterId: "",
        status: nextSelectedIds.length >= nextSlots ? "assigned" : "open",
      };
    });
    const editedTask = nextTasks.find((task) => task.id === selectedTaskId);
    const editedSelectedIds = selectedTesterIds(editedTask || {});
    const nextApplications = state.applications.map((item) =>
      item.taskId === selectedTaskId
        ? {
            ...item,
            status: editedSelectedIds.includes(item.testerId) ? "selected" : "pending",
          }
        : item,
    );
    commit({ ...state, tasks: nextTasks, applications: nextApplications });
    setTaskDetailsMode("view");
  }

  function applyToTask(taskId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (task?.status === "closed") return;
    if (task && selectedTesterIds(task).length >= taskSlots(task)) return;

    const alreadyApplied = state.applications.some(
      (item) => item.taskId === taskId && item.testerId === currentUser.id,
    );
    if (alreadyApplied) return;

    const newApplication = {
      id: crypto.randomUUID(),
      taskId,
      testerId: currentUser.id,
      message:
        applicationText[taskId] ||
        "I can complete the testing and prepare a clear report.",
      status: "pending",
    };
    commit({ ...state, applications: [newApplication, ...state.applications] });
    setApplicationText({ ...applicationText, [taskId]: "" });
  }

  function toggleTaskHiring(taskId) {
    const nextTasks = state.tasks.map((task) => {
      if (task.id !== taskId) return task;
      if (task.status === "closed") {
        const selectedCount = selectedTesterIds(task).length;
        return {
          ...task,
          status: selectedCount >= taskSlots(task) ? "assigned" : "open",
        };
      }
      return { ...task, status: "closed" };
    });
    commit({ ...state, tasks: nextTasks });
  }

  function deleteTask(taskId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;

    const confirmed = window.confirm(`Delete "${task.title}"? This will also remove applications and reports for this task.`);
    if (!confirmed) return;

    commit({
      ...state,
      tasks: state.tasks.filter((item) => item.id !== taskId),
      applications: state.applications.filter((item) => item.taskId !== taskId),
      reports: (state.reports || []).filter((item) => item.taskId !== taskId),
    });

    if (selectedTaskId === taskId) closeTaskDetails();
    if (workspaceTaskId === taskId) closeTesterWorkspace();
  }

  function selectTesterForTask(task, testerId) {
    const selectedIds = selectedTesterIds(task);
    if (selectedIds.includes(testerId)) return task;
    if (selectedIds.length >= taskSlots(task)) return task;

    const nextSelectedIds = [...selectedIds, testerId];
    return {
      ...task,
      status: nextSelectedIds.length >= taskSlots(task) ? "assigned" : "open",
      selectedTesterIds: nextSelectedIds,
      selectedTesterId: "",
    };
  }

  function chooseTester(taskId, testerId) {
    const nextTasks = state.tasks.map((task) =>
      task.id === taskId ? selectTesterForTask(task, testerId) : task,
    );
    const nextApplications = state.applications.map((item) =>
      item.taskId === taskId
        ? {
            ...item,
            status: selectedTesterIds(
              nextTasks.find((task) => task.id === taskId) || {},
            ).includes(item.testerId)
              ? "selected"
              : "pending",
          }
        : item,
    );
    commit({ ...state, tasks: nextTasks, applications: nextApplications });
  }

  function payTester(taskId, testerId) {
    const nextApplications = state.applications.map((item) =>
      item.taskId === taskId && item.testerId === testerId
        ? { ...item, paid: true }
        : item,
    );
    commit({ ...state, applications: nextApplications });
  }

  function completeTesting(taskId, testerId) {
    const nextApplications = state.applications.map((item) =>
      item.taskId === taskId && item.testerId === testerId
        ? { ...item, completed: true }
        : item,
    );
    commit({ ...state, applications: nextApplications });
  }

  function logout() {
    setCurrentUserId("");
    clearSession();
    setAuthForm({ name: "", login: "", password: "" });
    window.history.pushState({}, "", "/");
    setRoutePath("/");
  }

  if (!currentUser) {
    if (routePath.startsWith("/auth")) {
      return (
        <AuthScreen
          authError={authError}
          authForm={authForm}
          authMode={authMode}
          onAuth={handleAuth}
          onAuthErrorClear={() => setAuthError("")}
          onAuthFormChange={setAuthForm}
          onAuthModeChange={setAuthMode}
          onRoleChange={setRole}
          role={role}
          language={language}
          languageMeta={languageMeta}
          onLanguageChange={setLanguage}
          t={t}
          onGoHome={() => {
            window.history.pushState({}, "", "/");
            setRoutePath("/");
          }}
        />
      );
    }

    return (
      <LandingPage
        onOpenAuth={(mode) => {
          setAuthMode(mode || "login");
          if (mode === "register") setRole("");
          window.history.pushState({}, "", "/auth");
          setRoutePath("/auth");
        }}
        onOpenRegister={(nextRole) => {
          setAuthMode("register");
          setRole(nextRole || "");
          window.history.pushState({}, "", "/auth");
          setRoutePath("/auth");
        }}
        onOpenSignIn={() => {
          setAuthMode("login");
          setRole("");
          window.history.pushState({}, "", "/auth");
          setRoutePath("/auth");
        }}
        language={language}
        languageMeta={languageMeta}
        onLanguageChange={setLanguage}
        t={t}
      />
    );
  }

  if (routeProfileId) {
    return (
      <>
        <ProfilePage
          currentUser={currentUser}
          onBack={goBackFromProfile}
          onOpenMessage={openMessageModal}
          profile={routeProfile}
          t={t}
        />
        {renderMessageModal()}
      </>
    );
  }

  if (currentUser.role === "tester" && !currentUser.profileComplete) {
    return (
      <OnboardingProfile
        currentUser={currentUser}
        onLogout={logout}
        onProfileChange={setProfileForm}
        onUpdateProfile={updateProfile}
        profileForm={profileForm}
        t={t}
      />
    );
  }

  return (
    <main className="app-shell">
      <AppHeader
        currentUser={currentUser}
        language={language}
        onLogout={logout}
        onLanguageChange={setLanguage}
        onOpenProfile={navigateToProfile}
        t={t}
      />

      {currentUser.role === "tester" ? (
        <TesterDashboard
          applicationText={applicationText}
          currentUser={currentUser}
          onApply={applyToTask}
          onOpenProfile={navigateToOwnProfile}
          onOpenSettings={openSettings}
          onSendMessage={sendMessage}
          onStartTask={openTesterWorkspace}
          onViewTask={openTaskDetails}
          onSearch={setSearch}
        onTextChange={setApplicationText}
        onViewChange={setTesterView}
        search={search}
        state={state}
        t={t}
        view={testerView}
      />
      ) : (
        <ClientDashboard
          currentUser={currentUser}
          onChooseTester={chooseTester}
          onCreateTask={createTask}
          onDeleteTask={deleteTask}
          onOpenProfile={navigateToOwnProfile}
          onOpenSettings={openSettings}
          onSendMessage={sendMessage}
          onToggleTaskHiring={toggleTaskHiring}
          onViewApplications={openTaskApplications}
          onViewProfile={navigateToProfile}
          onViewTask={openTaskDetails}
          onTaskFormChange={setTaskForm}
          state={state}
          t={t}
          taskForm={taskForm}
        />
      )}

      {settingsOpen && (
        <AccountSettingsModal
          currentUser={currentUser}
          onClose={() => setSettingsOpen(false)}
          onFormChange={setSettingsForm}
          onSave={saveSettings}
          settingsForm={settingsForm}
          t={t}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          applicationText={applicationText}
          currentUser={currentUser}
          mode={taskDetailsMode}
          onApply={applyToTask}
          onChooseTester={chooseTester}
          onClose={closeTaskDetails}
          onEdit={startTaskEdit}
          onEditFormChange={setTaskEditForm}
          onCompleteTesting={completeTesting}
          onPayTester={payTester}
          onStartTask={openTesterWorkspace}
          onViewApplications={openTaskApplications}
          onViewTaskDetails={openTaskDetails}
          onViewProfile={navigateToProfile}
          onSaveEdit={saveTaskEdit}
          onTextChange={setApplicationText}
          state={state}
          t={t}
          task={selectedTask}
          taskEditForm={taskEditForm}
        />
      )}

      {workspaceTask && (
        <TesterWorkspaceModal
          currentUser={currentUser}
          onClose={closeTesterWorkspace}
          onFormChange={setReportForm}
          onReportToggle={() => setReportFormOpen(!reportFormOpen)}
          onSubmitReport={submitBugReport}
          reportForm={reportForm}
          reportFormOpen={reportFormOpen}
          t={t}
          task={workspaceTask}
        />
      )}

      {renderMessageModal()}
    </main>
  );
}


export default App;
