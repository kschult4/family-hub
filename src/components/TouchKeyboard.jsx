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
      <Keyboard
        keyboardRef={r => (keyboard.current = r)}
        layoutName={layoutName}
        onChange={onChangeInput}
        onKeyPress={handleKeyPress}
        theme="touch-keyboard-uniform"
        layout={{
          'default': [
            'q w e r t y u i o p {bksp}',
            'a s d f g h j k l {enter}',
            '{shift} z x c v b n m , . {shift}',
            '{space}'
          ],
          'shift': [
            'Q W E R T Y U I O P {bksp}',
            'A S D F G H J K L {enter}',
            '{shift} Z X C V B N M ! ? {shift}',
            '{space}'
          ]
        }}
        display={display}
        buttonTheme={[]}
      />
    </div>
  );

  // Render keyboard using portal to break out of modal context
  return typeof document !== 'undefined' 
    ? createPortal(keyboardContent, document.body)
    : null;
}