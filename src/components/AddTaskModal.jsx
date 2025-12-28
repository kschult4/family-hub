import { useState, useEffect, useRef } from "react";

export default function AddTaskModal({ isOpen, task, onClose, onSave, onDelete }) {
  const [description, setDescription] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (task) {
      setDescription(task.description || "");
    }
  }, [task]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Enable custom keyboard on mobile devices for better reliability
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                      (window.innerWidth <= 768);
      const enableCustomKeyboard = isMobile;
      
      if (enableCustomKeyboard) {
        setShowKeyboard(true);
        inputRef.current?.blur(); // Don't show system keyboard
      } else {
        // For desktop, focus input for native keyboard
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100); // Small delay to ensure modal is fully rendered
      }
    }
  }, [isOpen]);

  // ✅ Don't render if not open (but allow rendering if task exists for editing)
  if (!isOpen && !task) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) return;

    const newTask = {
      id: task ? task.id : `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      description: description.trim(),
      done: task ? task.done : false,
      addedAt: task ? task.addedAt : Date.now(),
    };

    onSave?.(newTask);
    onClose();
    setDescription("");
    setShowKeyboard(false);
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border" style={{ marginBottom: showKeyboard ? '300px' : '0' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">
              {task ? "Edit Task" : "Add a New To-Do"}
            </h2>
            <button
              onClick={() => {
                onClose();
                setShowKeyboard(false);
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl font-light"
            >
              ✕
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Task Description</label>
              <input
                ref={inputRef}
                type="text"
                className="w-full border rounded p-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
                autoCapitalize="sentences"
                autoCorrect="on"
                spellCheck="true"
                inputMode="text"
                placeholder="e.g. Take out trash"
              />
            </div>

            <div className="flex justify-between mt-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => {
                    onClose();
                    setShowKeyboard(false);
                  }}
                >
                  Cancel
                </button>
                {task && onDelete && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => {
                      onDelete(task);
                      onClose();
                      setShowKeyboard(false);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {showKeyboard ? (
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: '#f5f5f5', 
          padding: '12px', 
          borderTop: '1px solid #d1d5db',
          zIndex: 9999
        }}>
          
          {/* Top row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '2px', marginBottom: '2px' }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(key => (
              <button 
                key={key}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setDescription(prev => prev + key)}
                style={{ 
                  padding: '14px 8px', 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  cursor: 'pointer'
                }}
              >
                {key}
              </button>
            ))}
          </div>
          
          {/* QWERTY row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '2px', marginBottom: '2px' }}>
            {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(key => (
              <button 
                key={key}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setDescription(prev => prev + key)}
                style={{ 
                  padding: '14px 8px', 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  cursor: 'pointer'
                }}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* ASDF row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '2px', marginBottom: '2px' }}>
            {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(key => (
              <button 
                key={key}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setDescription(prev => prev + key)}
                style={{ 
                  padding: '14px 8px', 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  cursor: 'pointer'
                }}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* ZXCV row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '8px' }}>
            {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(key => (
              <button 
                key={key}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setDescription(prev => prev + key)}
                style={{ 
                  padding: '14px 8px', 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  cursor: 'pointer'
                }}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* Action buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2px' }}>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setDescription(prev => prev + ' ')}
              style={{ 
                padding: '12px', 
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: 'normal',
                touchAction: 'manipulation',
                cursor: 'pointer'
              }}
            >
              space
            </button>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setDescription(prev => prev.slice(0, -1))}
              style={{ 
                padding: '12px', 
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: 'normal',
                touchAction: 'manipulation',
                cursor: 'pointer'
              }}
            >
              ⌫
            </button>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setDescription('')}
              style={{ 
                padding: '12px', 
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: 'normal',
                touchAction: 'manipulation',
                cursor: 'pointer'
              }}
            >
              clear
            </button>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowKeyboard(false)}
              style={{ 
                padding: '12px', 
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: 'normal',
                touchAction: 'manipulation',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
