# EinDing

> Verknüpft mit: [[CLAUDE]] · [[GOALS]] · [[03 Projects/Things To Do/CLAUDE_Things To Do|Things To Do]]

## Worum geht's

Fokus-App gegen Felix' Muster, statt einer Aufgabe lieber YouTube zu schauen oder zu zocken — nicht weil er nicht weiß, was zu tun ist, sondern weil er trotzdem nicht anfängt. Eine normale Todo-Liste würde das Problem eher verschlimmern (30 Punkte = eine neue Entscheidung, "welchen zuerst?"). Deshalb zeigt der Fokus-Screen beim Öffnen nur **eine** Aufgabe, nicht die ganze Liste.

Zwei Bereiche geplant: **Fokus/Liste** für einmalige Aufgaben (Session 1+2) und **Täglich** für wiederkehrende Dinge wie Gym oder Morgenroutine (Session 2).

## Fokus-Mechanik (Kernidee)

- Startscreen (`#/`) zeigt die oberste offene Aufgabe groß, mit Projekt-Tag falls vorhanden, plus "+ N weitere warten".
- Button "Jetzt anfangen" → schaltet um auf "Erledigt" / "Später". Kein Timer, nur ein Klick als Commitment-Ritual gegen passives Wegwischen.
- "Erledigt" markiert die Aufgabe als fertig, die nächste rutscht nach.
- "Später" verschiebt die Aufgabe **3 Positionen nach hinten** (nicht ans Ende) und erhöht `skipCount`. Ab `skipCount >= 3` erscheint ein neutraler Hinweis-Badge. Wichtig: nicht ans Ende, sonst kann man unangenehme Aufgaben dauerhaft verstecken, indem man einmal "Später" klickt.
- Priorisierung ist rein die Array-Reihenfolge der Tasks — kein Punktesystem, keine Fälligkeitsdaten, keine Eisenhower-Matrix (bewusst, siehe Feature-Stop).

## Tech-Stack

- Reines HTML/CSS/JS, kein Build-Schritt (gleiches Muster wie Things To Do)
- `store.js` — Datenschicht: `tasks` und `daily` in localStorage, CRUD + `nextFocusTask()`/`skipTask()`
- `app.js` — Rendering (Fokus/Liste), Hash-Routing, `esc()`-Escaping (Task-Titel sind Nutzereingaben, XSS-Schutz nötig)
- PWA: `manifest.json` + `sw.js` (Network-First) + `icon.svg` → installierbar
- Hosting: GitHub Pages, Repo **öffentlich** (Free-Plan braucht das für Pages)

## Repo & Live-URL

- GitHub: `felixsf27/einding` (öffentlich)
- Live: https://felixsf27.github.io/einding/

## Was Claude hier tun soll

- Nach jeder Änderung direkt committen + pushen, ohne vorher zu fragen — persönliches Tool, genau wie bei Things To Do, anders als bei der Uptrail-Website
- GitHub Pages braucht nach Push meist 1-2 Minuten zum Neu-Deployen
- Feature-Stop aus Session 1 respektieren (siehe unten) — keine Gamification/Streaks/Notifications ungefragt hinzufügen, auch wenn's leicht wäre

## v1-Feature-Stop (bewusst nicht drin)

- Gamification (Punkte/Level/Badges) — würde selbst zum Ablenkungsobjekt
- Streaks — riskant bei Prokrastinationsmuster (ein verpasster Tag → "jetzt ist eh egal")
- Notifications/Erinnerungen — bräuchte Backend, widerspricht No-Backend-Prinzip
- Kategorien-Filter, Eisenhower-Matrix, Fälligkeitsdaten, Multi-Device-Sync/Login, Drag-and-drop

## Sicherheit

- Kein Login, kein Backend, keine Tokens
- Alle Nutzereingaben (Task-Titel, Projekt-Tag) werden vor dem Einfügen ins HTML escaped (`esc()` in `app.js`)
- Service Worker: Network-First (Updates kommen automatisch an)

## Status

18.07.2026: Session 1 gebaut und live — Fokus-Modus komplett (Jetzt anfangen → Erledigt/Später, Skip-Verschiebung, Skip-Badge), minimale Erfassung nur über Eingabefeld (`#/liste`, noch ohne Sortieren/Bearbeiten/Löschen). Daten-Layer (`store.js`) hat Täglich-Funktionen (`addDaily`, `toggleDaily`, `isDailyDoneToday`) schon vorbereitet, UI dafür kommt erst Session 2.

**Nächste Schritte (Session 2, erst nach 1-2 Tagen echter Nutzung von Session 1):**
- Täglich-Tab (`#/taeglich`) mit Checkboxen für wiederkehrende Punkte (Gym, Morgenroutine etc.)
- Volle Listen-Ansicht: Auf/Ab-Pfeile, Bearbeiten, Löschen, Projekt-Tag beim Anlegen, Erledigt-Sektion eingeklappt
- "Heute erledigt"-Zähler (kein Streak, nur Tages-Fakt)

**Session 3:** nur bei Bedarf, nach echter Nutzung — Bugfixing, kein neues Feature ohne konkreten Schmerzpunkt aus der Praxis.
