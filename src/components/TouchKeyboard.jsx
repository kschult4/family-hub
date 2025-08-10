import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

export default function TouchKeyboard({
  onChange,
  onKeyPress,
  inputRef,
  keyboardRef,
  layoutName = "default",
  theme = "hg-theme-default",
  display = {
    '{bksp}': '⌫',
    '{enter}': 'enter',
    '{shift}': '⇧',
    '{s}': '⇧',
    '{tab}': '⇥',
    '{lock}': 'caps',
    '{accept}': 'Submit',
    '{space}': ' ',
    '{//}': ' '
  }
}) {
  const keyboard = useRef();
  
  console.log('TouchKeyboard component rendered');

  useEffect(() => {
    if (keyboardRef) {
      keyboardRef.current = keyboard.current;
    }
  }, [keyboardRef]);

  const onChangeInput = (input) => {
    if (onChange) {
      onChange(input);
    }
  };

  const handleKeyPress = (button) => {
    if (button === '{shift}' || button === '{lock}') {
      handleShift();
    }
    if (onKeyPress) {
      onKeyPress(button);
    }
  };

  const handleShift = () => {
    const currentLayout = keyboard.current.options.layoutName;
    const shiftToggle = currentLayout === "default" ? "shift" : "default";
    
    keyboard.current.setOptions({
      layoutName: shiftToggle
    });
  };

  const keyboardContent = (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] touch-keyboard-container-fixed">
      <div style={{ background: 'green', color: 'white', padding: '10px', textAlign: 'center' }}>
        KEYBOARD RENDERED - Layout: {layoutName}
      </div>
      {/* Temporarily replace with simple keyboard to test */}
      <div style={{ background: 'white', padding: '20px', border: '2px solid green' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '5px', marginBottom: '10px' }}>
          {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(key => (
            <button 
              key={key}
              onClick={() => {
                console.log('Key pressed:', key);
                if (onChange) {
                  // Get current input and append the key
                  onChange(key);
                }
              }}
              style={{ 
                padding: '15px', 
                backgroundColor: '#f0f0f0', 
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {key}
            </button>
          ))}
        </div>
        <button 
          onClick={() => onChangeInput && onChangeInput('')}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#ff6b6b', 
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );

  // Add error boundary check
  try {
    console.log('TouchKeyboard: About to render portal');
    // Render keyboard using portal to break out of modal context
    return typeof document !== 'undefined' 
      ? createPortal(keyboardContent, document.body)
      : null;
  } catch (error) {
    console.error('TouchKeyboard render error:', error);
    return (
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        background: 'red', 
        color: 'white', 
        padding: '20px',
        textAlign: 'center',
        zIndex: 9999 
      }}>
        TouchKeyboard Error: {error.message}
      </div>
    );
  }
}