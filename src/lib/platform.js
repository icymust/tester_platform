export const STORAGE_KEY = "betahub-state-v3";
export const SESSION_KEY = "betahub-session-v1";

export const seedState = {
  users: [],
  tasks: [],
  applications: [],
  reports: [],
  messages: [],
};

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...seedState, ...JSON.parse(saved) } : seedState;
  } catch {
    return seedState;
  }
}

export function saveState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

export function taskSlots(task) {
  const parsed = Number(task.slots);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

export function selectedTesterIds(task) {
  if (Array.isArray(task.selectedTesterIds)) return task.selectedTesterIds;
  return task.selectedTesterId ? [task.selectedTesterId] : [];
}

export function taskPayout(task) {
  const budget = Number(task.budget) || 0;
  return budget / taskSlots(task);
}

export function money(value) {
  const amount = Number(value) || 0;
  return amount % 1 === 0 ? `AED ${amount}` : `AED ${amount.toFixed(2)}`;
}

export function formatDeadline(value) {
  if (!value) return "No deadline";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function loadSession() {
  try {
    return localStorage.getItem(SESSION_KEY) || "";
  } catch {
    return "";
  }
}

export function saveSession(userId) {
  localStorage.setItem(SESSION_KEY, userId);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getRoutePath() {
  return window.location.pathname;
}

export function profileIdFromPath(path) {
  const match = path.match(/^\/profiles\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : "";
}
