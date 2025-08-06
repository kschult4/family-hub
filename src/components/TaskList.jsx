import { useState, useEffect, useRef } from "react";
import AddTaskModal from "./AddTaskModal";
import SectionHeader from "./SectionHeader";

const frequencies = ["daily", "weekly", "monthly", "quarterly"];

const frequencyColors = {
  daily: "#69A5D1",
  weekly: "#B75634",
  monthly: "#EFB643",
  quarterly: "#6AA968",
};

export default function TaskList() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks");
    return stored
      ? JSON.parse(stored)
      : [
          {
            id: 1,
            description: "Feed Coltrane",
            frequency: "daily",
            recurring: true,
            done: false,
          },
          {
            id: 2,
            description: "Unload dishwasher",
            frequency: "daily",
            recurring: false,
            done: false,
          },
        ];
  });

  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deletedTaskIds, setDeletedTaskIds] = useState([]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    setTasks((prev) =>
      prev.map((task) => {
        if (!task.recurring || !task.lastCompleted || !task.done) return task;

        const last = new Date(task.lastCompleted);
        const now = new Date();
        const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
        const days = {
          daily: 1,
          weekly: 7,
          monthly: 30,
          quarterly: 120,
        }[task.frequency];
        if (diff >= days)
          return { ...task, done: false, lastCompleted: null };
        return task;
      })
    );
  }, []);

  function toggleTask(id) {
    setDeletedTaskIds((prev) => [...prev, id]);

    setTimeout(() => {
      setTasks((prev) =>
        prev
          .map((task) =>
            task.id === id
              ? {
                  ...task,
                  done: !task.done,
                  lastCompleted: !task.done ? new Date().toISOString() : null,
                }
              : task
          )
          .filter((task) => !(task.id === id && !task.recurring))
      );

      setDeletedTaskIds((prev) => prev.filter((tid) => tid !== id));
    }, 300);
  }

  function handleLongPress(task) {
    setEditTask(task);
  }

  return (
    <div className="h-full">
      <SectionHeader
        title="Our Tasks"
        className="mb-4"
        rightSlot={
          <button
            className="text-white bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-blue-600 transition"
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        }
      />

      <div className="bg-white rounded-2xl shadow-md p-6 h-[500px] overflow-y-auto flex flex-col">
        {frequencies.map((group) => {
          const groupTasks = tasks.filter(
            (t) => t.frequency === group && !t.done
          );
          if (groupTasks.length === 0) return null;

          return (
            <div key={group} className="mb-block">
              <h3
                className="text-sm font-semibold uppercase tracking-wide mb-2"
                style={{ color: frequencyColors[group] }}
              >
                {group}
              </h3>
              <ul className="space-y-2">
                {groupTasks.map((task) => {
                  const longPressTimer = useRef(null);
                  const [ripples, setRipples] = useState([]);

                  const onPointerDown = (e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    longPressTimer.current = setTimeout(() => {
                      setRipples((prev) => [
                        ...prev,
                        { id: Date.now(), x, y },
                      ]);
                      handleLongPress(task);
                    }, 600);
                  };

                  const onPointerUp = () => {
                    clearTimeout(longPressTimer.current);
                  };

                  const onAnimationEnd = (id) => {
                    setRipples((prev) => prev.filter((r) => r.id !== id));
                  };

                  return (
                    <li
                      key={task.id}
                      onPointerDown={onPointerDown}
                      onPointerUp={onPointerUp}
                      onPointerLeave={onPointerUp}
                      className={`
                        relative overflow-hidden flex items-center justify-between
                        rounded-md px-4 py-4 text-base text-white transition-all duration-300
                        ${deletedTaskIds.includes(task.id) ? "opacity-0 translate-x-4" : ""}
                      `}
                      style={{
                        backgroundColor: frequencyColors[task.frequency],
                      }}
                    >
                      {ripples.map((ripple) => (
                        <span
                          key={ripple.id}
                          onAnimationEnd={() => onAnimationEnd(ripple.id)}
                          className="absolute pointer-events-none animate-ripple bg-black/10 rounded-full"
                          style={{
                            left: ripple.x,
                            top: ripple.y,
                            width: 100,
                            height: 100,
                            marginLeft: -50,
                            marginTop: -50,
                          }}
                        />
                      ))}

                      <div className="flex items-center gap-3 w-full">
                        <input
                          type="checkbox"
                          className="w-5 h-5"
                          checked={task.done}
                          onChange={() => toggleTask(task.id)}
                        />
                        <span className="w-full cursor-pointer">
                          {task.description}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {showModal && (
          <AddTaskModal
            onClose={() => setShowModal(false)}
            onSave={(newTask) => {
              setTasks((prev) => [...prev, newTask]);
              setShowModal(false);
            }}
          />
        )}

        {editTask && (
          <AddTaskModal
            task={editTask}
            onClose={() => setEditTask(null)}
            onSave={(updatedTask) => {
              setTasks((prev) =>
                prev.map((task) =>
                  task.id === updatedTask.id ? updatedTask : task
                )
              );
              setEditTask(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
