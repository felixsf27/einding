function loadTasks() {
  try { return JSON.parse(localStorage.getItem("tasks")) || []; }
  catch { return []; }
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadDaily() {
  try { return JSON.parse(localStorage.getItem("daily")) || []; }
  catch { return []; }
}

function saveDaily(items) {
  localStorage.setItem("daily", JSON.stringify(items));
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function addTask(title, project) {
  const tasks = loadTasks();
  tasks.push({
    id: makeId("t"),
    title,
    project: project || null,
    done: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    skipCount: 0
  });
  saveTasks(tasks);
}

function nextFocusTask() {
  return loadTasks().find(t => !t.done) || null;
}

function openTaskCount() {
  return loadTasks().filter(t => !t.done).length;
}

function completeTask(id) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = true;
    task.completedAt = new Date().toISOString();
    saveTasks(tasks);
  }
}

// Verschiebt eine offene Aufgabe 3 Positionen nach hinten (innerhalb der offenen Aufgaben),
// statt sie ans Ende zu schieben — sonst könnte man unangenehme Aufgaben dauerhaft verstecken.
function skipTask(id) {
  const tasks = loadTasks();
  const openIdx = tasks.map((t, i) => ({ t, i })).filter(x => !x.t.done).map(x => x.i);
  const posInOpen = openIdx.findIndex(i => tasks[i].id === id);
  if (posInOpen === -1) return;
  const fromIdx = openIdx[posInOpen];
  const targetPosInOpen = Math.min(posInOpen + 3, openIdx.length - 1);
  const toIdx = openIdx[targetPosInOpen];
  const [task] = tasks.splice(fromIdx, 1);
  task.skipCount = (task.skipCount || 0) + 1;
  tasks.splice(toIdx, 0, task);
  saveTasks(tasks);
}

function deleteTask(id) {
  saveTasks(loadTasks().filter(t => t.id !== id));
}

function editTaskTitle(id, title) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (task) { task.title = title; saveTasks(tasks); }
}

function moveTask(id, direction) {
  const tasks = loadTasks();
  const i = tasks.findIndex(t => t.id === id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= tasks.length) return;
  [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
  saveTasks(tasks);
}

function addDaily(title) {
  const items = loadDaily();
  items.push({ id: makeId("d"), title, lastDoneDate: null });
  saveDaily(items);
}

function isDailyDoneToday(item) {
  return item.lastDoneDate === todayISO();
}

function toggleDaily(id) {
  const items = loadDaily();
  const item = items.find(d => d.id === id);
  if (!item) return;
  item.lastDoneDate = isDailyDoneToday(item) ? null : todayISO();
  saveDaily(items);
}

function deleteDaily(id) {
  saveDaily(loadDaily().filter(d => d.id !== id));
}

// Läuft einmalig pro Browser/Gerät, damit ein paar bekannte offene Punkte
// nicht von Hand eingetippt werden müssen. Danach nie wieder (Flag in localStorage).
function seedDefaultTasksOnce() {
  if (localStorage.getItem("seedApplied")) return;
  addTask("Bibel weiterlesen (Markus 9)", "Bibel");
  addTask("Für Umschulung lernen (REWE & Tabellenkalkulation)", "Umschulung");
  addTask("Ins Gym gehen", "Fitness");
  localStorage.setItem("seedApplied", "1");
}
