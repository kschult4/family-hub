import { useState, useRef } from "react";
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

// All tasks use the same blue color
const TASK_COLOR = "#69A5D1";

export default function TaskList({ tasks = [], setTasks, addTask, updateTask, removeTask }) {
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deletedTaskIds, setDeletedTaskIds] = useState([]);

  function toggleTask(id) {
    // Find the task to toggle
    const task = tasks.find(t => t.id === id);
    if (!task) {
      console.error('Task not found:', id);
      return;
    }

    // Add to deletion animation
    setDeletedTaskIds((prev) => [...prev, id]);

    // After animation, permanently remove from database
    setTimeout(() => {
      if (removeTask) {
        removeTask(id);
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
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {tasks
              .filter((t) => !t.done)
              .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0)) // Sort by addedAt, newest first
              .map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onLongPress={handleLongPress}
                  isDeleting={deletedTaskIds.includes(task.id)}
                  frequencyColor={TASK_COLOR}
                />
              ))}
          </ul>
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
