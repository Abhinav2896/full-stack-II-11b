import React, { useEffect, useMemo, useRef, useState } from "react";

const initialTasks = [
  {
    id: 1,
    title: "Memoization",
    type: "Optimization",
    date: "2026-08-19",
    time: "10:00",
    duration: 45,
    description: "Optimize repeated calculations with memoization."
  },
  {
    id: 2,
    title: "Lazy Loading",
    type: "Optimization",
    date: "2026-08-21",
    time: "14:00",
    duration: 60,
    description: "Load expensive UI/code only when it is required."
  },
  {
    id: 3,
    title: "Nested Loops",
    type: "Non-Optimization",
    date: "2026-08-20",
    time: "11:00",
    duration: 50,
    description: "Baseline implementation with nested iteration."
  },
  {
    id: 4,
    title: "Repeated Rendering",
    type: "Non-Optimization",
    date: "2026-08-22",
    time: "15:00",
    duration: 40,
    description: "Baseline version without render optimization."
  }
];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const pad = (n) => String(n).padStart(2, "0");

function getCalendarDays(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      day: d.getDate(),
      currentMonth: d.getMonth() === month
    };
  });
}

export default function App() {
  const today = new Date();
  const [view, setView] = useState("Optimization");
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);

  const renderCount = useRef(0);
  const [, forceRender] = useState(0);
  renderCount.current += 1;

  useEffect(() => {
    const id = requestAnimationFrame(() => forceRender((x) => x + 1));
    return () => cancelAnimationFrame(id);
  }, [tasks, view, month, year, selectedTask]);

  const days = useMemo(() => getCalendarDays(year, month), [year, month]);

  const visibleTasks = useMemo(
    () => tasks.filter((task) => task.type === view),
    [tasks, view]
  );

  const stats = useMemo(() => ({
    total: visibleTasks.length,
    minutes: visibleTasks.reduce((sum, task) => sum + task.duration, 0),
    scheduledDays: new Set(visibleTasks.map((task) => task.date)).size
  }), [visibleTasks]);

  function changeMonth(direction) {
    if (direction === 1 && month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else if (direction === -1 && month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m + direction);
    }
  }

  function handleDragStart(e, taskId) {
    e.dataTransfer.setData("taskId", String(taskId));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e, targetDate) {
    e.preventDefault();
    const taskId = Number(e.dataTransfer.getData("taskId"));
    if (!taskId) return;

    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, date: targetDate } : task
      )
    );
  }

  function resetSchedule() {
    setTasks(initialTasks);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="eyebrow">REACT • HCI • INFORMATION VISUALIZATION</div>
          <h1>CodeFlow Scheduler</h1>
          <p>Interactive calendar for scheduling and managing development work.</p>
        </div>

        <div className="render-card">
          <span className="render-dot" />
          <div>
            <strong>{renderCount.current}</strong>
            <small>component renders</small>
          </div>
        </div>
      </header>

      <main className="dashboard">
        <section className="control-panel">
          <div className="toggle">
            <button
              className={view === "Optimization" ? "active" : ""}
              onClick={() => setView("Optimization")}
            >
              ⚡ Optimization
            </button>
            <button
              className={view === "Non-Optimization" ? "active danger" : ""}
              onClick={() => setView("Non-Optimization")}
            >
              ○ Non-Optimization
            </button>
          </div>

          <div className="stats">
            <div><span>Tasks</span><b>{stats.total}</b></div>
            <div><span>Scheduled days</span><b>{stats.scheduledDays}</b></div>
            <div><span>Total time</span><b>{stats.minutes}m</b></div>
          </div>

          <button className="reset" onClick={resetSchedule}>Reset schedule</button>
        </section>

        <section className="calendar-card">
          <div className="calendar-header">
            <div>
              <h2>{monthNames[month]} {year}</h2>
              <span>{view} workload</span>
            </div>
            <div className="month-actions">
              <button onClick={() => changeMonth(-1)}>‹</button>
              <button onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}>Today</button>
              <button onClick={() => changeMonth(1)}>›</button>
            </div>
          </div>

          <div className="weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {days.map((day) => {
              const dayTasks = visibleTasks.filter((task) => task.date === day.date);
              const isToday = day.date === `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;

              return (
                <div
                  key={day.date}
                  className={`day ${!day.currentMonth ? "muted" : ""} ${isToday ? "today" : ""}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, day.date)}
                >
                  <div className="day-number">{day.day}</div>

                  <div className="task-list">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => setSelectedTask(task)}
                        className={`task ${task.type === "Optimization" ? "optimized" : "baseline"}`}
                        title="Drag to another day"
                      >
                        <div className="task-title">{task.title}</div>
                        <div className="task-time">{task.time} • {task.duration} min</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="calendar-footer">
            <span><i className="legend optimized-dot" /> Optimization</span>
            <span><i className="legend baseline-dot" /> Non-Optimization</span>
            <span className="drag-hint">↕ Drag a task to another day</span>
          </div>
        </section>

        <aside className="side-panel">
          <div className="panel-block">
            <div className="panel-heading">
              <span>Render Monitor</span>
              <span className="live">LIVE</span>
            </div>
            <div className="big-number">{renderCount.current}</div>
            <p>App render cycles during the current session.</p>
            <div className="meter">
              <span style={{ width: `${Math.min(renderCount.current * 8, 100)}%` }} />
            </div>
          </div>

          <div className="panel-block">
            <div className="panel-heading">
              <span>Current Mode</span>
              <span className="mode-badge">{view === "Optimization" ? "FAST" : "BASELINE"}</span>
            </div>
            <h3>{view}</h3>
            <p>
              {view === "Optimization"
                ? "Optimized tasks demonstrate techniques that can reduce unnecessary computation or loading."
                : "Baseline tasks intentionally show work without optimization techniques for comparison."}
            </p>
          </div>

          <div className="panel-block">
            <div className="panel-heading"><span>Interaction</span></div>
            <ul>
              <li>Click a task to inspect it.</li>
              <li>Drag a task to a different date.</li>
              <li>Switch modes with the toggle.</li>
              <li>Use month controls to navigate.</li>
            </ul>
          </div>
        </aside>
      </main>

      {selectedTask && (
        <div className="modal-backdrop" onClick={() => setSelectedTask(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelectedTask(null)}>×</button>
            <span className={`pill ${selectedTask.type === "Optimization" ? "green" : "orange"}`}>
              {selectedTask.type}
            </span>
            <h2>{selectedTask.title}</h2>
            <p>{selectedTask.description}</p>
            <div className="details">
              <div><span>Date</span><b>{selectedTask.date}</b></div>
              <div><span>Time</span><b>{selectedTask.time}</b></div>
              <div><span>Duration</span><b>{selectedTask.duration} min</b></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
