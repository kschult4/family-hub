import { useState, useEffect, useRef } from "react";
import AddTaskModal from "./AddTaskModal";
import SectionHeader from "./SectionHeader";

// TaskItem component to avoid hooks violations
function TaskItem({ task, onToggle, onLongPress, isDeleting, frequencyColor }) {
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
      onLongPress(task);
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
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{
        backgroundColor: frequencyColor,
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        padding: '14px 12px',
        borderRadius: '6px',
        marginBottom: '8px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        opacity: isDeleting ? 0 : 1,
        transform: isDeleting ? 'translateX(16px)' : 'translateX(0)'
      }}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          onAnimationEnd={() => onAnimationEnd(ripple.id)}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '50%',
            left: ripple.x,
            top: ripple.y,
            width: 100,
            height: 100,
            marginLeft: -50,
            marginTop: -50,
            animation: 'ripple 0.6s linear'
          }}
        />
      ))}

      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        style={{
          width: '16px',
          height: '16px',
          marginRight: '12px',
          flexShrink: 0
        }}
      />
      <span 
        onClick={() => onToggle(task.id)}
        style={{
          flex: 1,
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'Lato, sans-serif',
          cursor: 'pointer',
          lineHeight: '1.2'
        }}
      >
        {task.description}
      </span>
      {/* Cache buster v4 - COMPLETE REWRITE */}
    </li>
  );
}

const frequencies = ["daily", "weekly", "monthly", "quarterly"];

const frequencyColors = {
  daily: "#69A5D1",
  weekly: "#B75634",
  monthly: "#EFB643",
  quarterly: "#6AA968",
};

export default function TaskList({ tasks = [], setTasks, addTask, updateTask, removeTask }) {
  // Initialize with default tasks if no tasks provided
  const defaultTasks = [
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
    {
      id: 3,
      description: "Take out trash",
      frequency: "weekly",
      recurring: true,
      done: false,
    },
    {
      id: 4,
      description: "Change air filter",
      frequency: "monthly",
      recurring: true,
      done: false,
    },
    // Placeholder quarterly task
          {
            id: 5,
            description: "Clean gutters",
            frequency: "quarterly",
            recurring: true,
            done: false,
          },
  ];

  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deletedTaskIds, setDeletedTaskIds] = useState([]);

  // Initialize with default tasks if tasks array is empty
  useEffect(() => {
    if (tasks.length === 0 && setTasks) {
      setTasks(defaultTasks);
    }
  }, [tasks.length, setTasks, defaultTasks]);


  useEffect(() => {
    if (setTasks && tasks.length > 0) {
      const updatedTasks = tasks.map((task) => {
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
      });
      
      // Only update if there were actual changes
      if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
        setTasks(updatedTasks);
      }
    }
  }, [setTasks, tasks]);

  function toggleTask(id) {
    setDeletedTaskIds((prev) => [...prev, id]);

    setTimeout(() => {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const updatedTask = {
        ...task,
        done: !task.done,
        lastCompleted: !task.done ? new Date().toISOString() : null,
      };

      if (!task.recurring && !task.done) {
        // Remove non-recurring completed tasks
        if (removeTask) {
          removeTask(id);
        } else if (setTasks) {
          const updatedTasks = tasks.filter((task) => task.id !== id);
          setTasks(updatedTasks);
        }
      } else {
        // Update recurring or unchecked tasks
        if (updateTask) {
          updateTask(id, updatedTask);
        } else if (setTasks) {
          const updatedTasks = tasks.map((task) =>
            task.id === id ? updatedTask : task
          );
          setTasks(updatedTasks);
        }
      }

      setDeletedTaskIds((prev) => prev.filter((tid) => tid !== id));
    }, 300);
  }

  function handleLongPress(task) {
    setEditTask(task);
  }

  return (
    <>
      <div className="h-full">
        <SectionHeader
          title="Our Tasks"
          className="mb-4"
        />

        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 h-[500px] overflow-y-auto flex flex-col scrollbar-hide">
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
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {groupTasks.map((task) => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTask} 
                      onLongPress={handleLongPress}
                      isDeleting={deletedTaskIds.includes(task.id)}
                      frequencyColor={frequencyColors[task.frequency]}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals rendered outside the main container to avoid z-index issues */}
      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onSave={(newTask) => {
            if (addTask) {
              addTask(newTask);
            } else if (setTasks) {
              setTasks([...tasks, newTask]);
            }
            setShowModal(false);
          }}
        />
      )}

      {editTask && (
        <AddTaskModal
          isOpen={true}
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={(updatedTask) => {
            if (updateTask) {
              updateTask(updatedTask.id, updatedTask);
            } else if (setTasks) {
              const updatedTasks = tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
              );
              setTasks(updatedTasks);
            }
            setEditTask(null);
          }}
          onDelete={(taskToDelete) => {
            if (removeTask) {
              removeTask(taskToDelete.id);
            } else if (setTasks) {
              const updatedTasks = tasks.filter((task) => task.id !== taskToDelete.id);
              setTasks(updatedTasks);
            }
            setEditTask(null);
          }}
        />
      )}
    </>
  );
}
