import { useState, useEffect, useRef } from "react";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export default function MealsModal({ isOpen, initialData, onClose, onSave }) {
  const [formData, setFormData] = useState(initialData || {});
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [keyboardDismissed, setKeyboardDismissed] = useState(false);
  const firstInputRef = useRef(null);
  const keyboardRef = useRef(null);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      // Never show custom keyboard on mobile devices or web browsers
      // Only show on specific Raspberry Pi setup
      const isRaspberryPi = navigator.userAgent.includes('Linux') && 
                           navigator.userAgent.includes('armv') &&
                           window.innerWidth >= 1024; // Large screen
      
      if (isRaspberryPi) {
        setShowKeyboard(true);
        setActiveField(daysOfWeek[0]);
        setKeyboardDismissed(false); // Reset dismissal state when modal opens
        firstInputRef.current?.blur(); // Don't show system keyboard
      } else {
        firstInputRef.current.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null; // ✅ Don't render if not open

  const handleChange = (day, value) => {
    setFormData({ ...formData, [day]: value });
  };

  const handleKeyboardChange = (input) => {
    if (activeField) {
      setFormData({ ...formData, [activeField]: input });
    }
  };

  const handleKeyboardKeyPress = (button) => {
    if (button === '{enter}') {
      // Move to next field or submit if on last field
      const currentIndex = daysOfWeek.indexOf(activeField);
      if (currentIndex < daysOfWeek.length - 1) {
        setActiveField(daysOfWeek[currentIndex + 1]);
      } else {
        handleSubmit({ preventDefault: () => {} });
      }
    }
  };

  const handleInputFocus = (day) => {
    setActiveField(day);
    
    // Never show custom keyboard on mobile devices or web browsers
    // Only show on specific Raspberry Pi setup
    const isRaspberryPi = navigator.userAgent.includes('Linux') && 
                         navigator.userAgent.includes('armv') &&
                         window.innerWidth >= 1024; // Large screen
    
    // Force keyboard to show only on Raspberry Pi, even if it was manually dismissed
    if (isRaspberryPi) {
      setShowKeyboard(true);
      setKeyboardDismissed(false); // Clear dismissal state when focusing
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('MealsModal: handleSubmit called with formData:', formData);
    console.log('MealsModal: calling onSave with:', formData);
    onSave?.(formData);
    onClose();
    setShowKeyboard(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-xl shadow-modal p-6 w-full max-w-md"
          style={{ marginBottom: showKeyboard ? '300px' : '0' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Edit Weekly Meals</h2>
            <button
              type="button"
              onClick={() => {
                onClose();
                setShowKeyboard(false);
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl font-light"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto scrollbar-hide">
            {daysOfWeek.map((day) => (
              <div key={day}>
                <label className="block text-sm font-medium text-gray-700">
                  {day} {activeField === day && showKeyboard && '← Typing here'}
                </label>
                <input
                  ref={day === daysOfWeek[0] ? firstInputRef : null}
                  type="text"
                  value={formData[day] || ""}
                  onChange={(e) => handleChange(day, e.target.value)}
                  onFocus={() => handleInputFocus(day)}
                  className={`w-full border border-gray-300 rounded px-2 py-1 mt-1 text-sm ${
                    activeField === day && showKeyboard ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                setShowKeyboard(false);
              }}
              className="px-4 py-2 rounded text-sm bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
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
                onClick={() => handleKeyboardChange((formData[activeField] || '') + key)}
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
                onClick={() => handleKeyboardChange((formData[activeField] || '') + key)}
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
                onClick={() => handleKeyboardChange((formData[activeField] || '') + key)}
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
                onClick={() => handleKeyboardChange((formData[activeField] || '') + key)}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '2px' }}>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleKeyboardChange((formData[activeField] || '') + ' ')}
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
              onClick={() => handleKeyboardChange((formData[activeField] || '').slice(0, -1))}
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
              onClick={() => handleKeyboardChange('')}
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
              onClick={() => {
                const currentIndex = daysOfWeek.indexOf(activeField);
                if (currentIndex < daysOfWeek.length - 1) {
                  setActiveField(daysOfWeek[currentIndex + 1]);
                }
              }}
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
              next
            </button>
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setShowKeyboard(false);
                setKeyboardDismissed(true); // Track manual dismissal
              }}
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
