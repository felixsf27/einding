// Text escapen, bevor er ins HTML eingefügt wird — Schutz gegen XSS,
// da Aufgaben-Titel hier Nutzereingaben sind.
function esc(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// In welchem Zustand der Fokus-Screen gerade steht ("Jetzt anfangen" vs. "Erledigt"/"Später").
// Kein Timer, kein Persistieren nötig — reset automatisch, sobald sich die oberste Aufgabe ändert.
let startedTaskId = null;

function renderFokus() {
  const main = document.getElementById("main");
  const task = nextFocusTask();

  if (!task) {
    main.innerHTML = `
      <div class="fokus empty-state">
        <p class="empty">Nichts offen.</p>
        <form id="quick-add" class="quick-add">
          <input type="text" id="quick-add-input" placeholder="Neue Aufgabe..." autofocus />
          <button type="submit">Hinzufügen</button>
        </form>
      </div>
    `;
    wireQuickAdd(renderFokus);
    return;
  }

  const remaining = openTaskCount() - 1;
  const started = startedTaskId === task.id;

  main.innerHTML = `
    <div class="fokus">
      ${task.project ? `<span class="tag">${esc(task.project)}</span>` : ""}
      <h2 class="task-title">${esc(task.title)}</h2>
      ${task.skipCount >= 3 ? `<p class="skip-badge">${task.skipCount}x verschoben</p>` : ""}
      <div class="actions">
        ${started
          ? `<button id="btn-done" class="primary">Erledigt</button>
             <button id="btn-skip" class="secondary">Später</button>`
          : `<button id="btn-start" class="primary">Jetzt anfangen</button>`
        }
      </div>
      ${remaining > 0 ? `<p class="rest">+ ${remaining} weitere ${remaining === 1 ? "wartet" : "warten"}</p>` : ""}
      <a class="footer-link" href="#/liste">Liste bearbeiten →</a>
    </div>
  `;

  const startBtn = document.getElementById("btn-start");
  if (startBtn) startBtn.addEventListener("click", () => { startedTaskId = task.id; renderFokus(); });

  const doneBtn = document.getElementById("btn-done");
  if (doneBtn) doneBtn.addEventListener("click", () => { completeTask(task.id); startedTaskId = null; renderFokus(); });

  const skipBtn = document.getElementById("btn-skip");
  if (skipBtn) skipBtn.addEventListener("click", () => { skipTask(task.id); startedTaskId = null; renderFokus(); });
}

function wireQuickAdd(onAdded) {
  const form = document.getElementById("quick-add");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("quick-add-input");
    const title = input.value.trim();
    if (!title) return;
    addTask(title, null);
    onAdded();
  });
}

// Session 1: minimale Erfassung — nur Eingabefeld + einfache Liste der offenen Aufgaben.
// Sortieren/Bearbeiten/Löschen/Projekt-Tags kommen in Session 2.
function renderListe() {
  const main = document.getElementById("main");
  const tasks = loadTasks().filter(t => !t.done);

  main.innerHTML = `
    <div class="liste">
      <a class="back-link" href="#/">← Fokus</a>
      <form id="quick-add" class="quick-add">
        <input type="text" id="quick-add-input" placeholder="Neue Aufgabe..." autofocus />
        <button type="submit">Hinzufügen</button>
      </form>
      ${tasks.length === 0
        ? `<p class="empty">Noch keine Aufgaben.</p>`
        : tasks.map(t => `<div class="row">${esc(t.title)}</div>`).join("")
      }
    </div>
  `;
  wireQuickAdd(renderListe);
}

function render() {
  const hash = location.hash || "#/";
  if (hash === "#/liste") renderListe();
  else renderFokus();
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-title").addEventListener("click", () => { location.hash = "#/"; });
  seedDefaultTasksOnce();
  render();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
});
