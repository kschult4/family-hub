import { useCallback } from 'react';

export function useVoiceCommands() {
  
  const parseShoppingListCommand = useCallback((transcript) => {
    const text = transcript.toLowerCase().trim();
    console.log('🛒 Testing shopping list patterns for:', text);
    
    // Shopping list patterns - MUST explicitly mention shopping/grocery list
    const shoppingPatterns = [
      /^add (.+) to (?:my |the )?(?:shopping list|grocery list|groceries)$/,
      /^put (.+) on (?:my |the )?(?:shopping list|grocery list|groceries)$/,
      /^(?:shopping list|grocery list|groceries) add (.+)$/,
      /^(?:shopping list|grocery list|groceries) (.+)$/,
      /^grocery (.+)$/,
      /^shopping (.+)$/
    ];
    
    for (let i = 0; i < shoppingPatterns.length; i++) {
      const pattern = shoppingPatterns[i];
      console.log(`🔍 Testing pattern ${i + 1}: ${pattern.source}`);
      const match = text.match(pattern);
      console.log(`🎯 Pattern ${i + 1} match result:`, match);
      
      if (match) {
        const item = match[1].trim();
        console.log('📝 Raw item extracted:', item);
        
        // Clean up common speech recognition artifacts
        const cleanItem = item
          .replace(/\b(a|an|the|some)\b/g, '') // Remove articles
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim();
        
        console.log('✨ Cleaned item:', cleanItem);
        
        if (cleanItem.length > 0) {
          const result = {
            type: 'shopping_list',
            action: 'add',
            item: cleanItem,
            confidence: 'high'
          };
          console.log('✅ Shopping list command created:', result);
          return result;
        }
      }
    }
    
    console.log('❌ No shopping list patterns matched');
    return null;
  }, []);

  const parseTaskCommand = useCallback((transcript) => {
    const text = transcript.toLowerCase().trim();
    
    // Task patterns - MUST explicitly mention task/todo
    const taskPatterns = [
      /^add task (.+)$/,
      /^add (?:a )?(?:new )?task (.+)$/,
      /^add to[- ]?do (.+)$/,
      /^create (?:a )?(?:new )?task (.+)$/,
      /^new task (.+)$/,
      /^task (.+)$/,
      /^to[- ]?do (.+)$/,
      /^add (.+) to (?:my |the )?(?:tasks|to[- ]?do list|task list)$/,
      /^put (.+) on (?:my |the )?(?:tasks|to[- ]?do list|task list)$/,
      /^(?:tasks|to[- ]?do list|task list) add (.+)$/,
      /^(?:tasks|to[- ]?do list|task list) (.+)$/
    ];
    
    for (const pattern of taskPatterns) {
      const match = text.match(pattern);
      if (match) {
        const task = match[1].trim();
        
        if (task.length > 0) {
          return {
            type: 'task',
            action: 'add',
            task: task,
            confidence: 'high'
          };
        }
      }
    }
    
    // Task completion patterns
    const completePatterns = [
      /^(?:mark|complete|finish|done) (.+)$/,
      /^(.+) is (?:done|complete|finished)$/,
      /^check off (.+)$/
    ];
    
    for (const pattern of completePatterns) {
      const match = text.match(pattern);
      if (match) {
        const task = match[1].trim();
        
        if (task.length > 0) {
          return {
            type: 'task',
            action: 'complete',
            task: task,
            confidence: 'medium'
          };
        }
      }
    }
    
    return null;
  }, []);

  const parseCommand = useCallback((transcript, confidence = 1.0) => {
    if (!transcript || transcript.trim().length === 0) {
      return null;
    }

    console.log('🧠 Parsing voice command:', transcript);

    // Try shopping list commands first
    const shoppingCommand = parseShoppingListCommand(transcript);
    if (shoppingCommand) {
      return {
        ...shoppingCommand,
        originalTranscript: transcript,
        speechConfidence: confidence
      };
    }

    // Try task commands
    const taskCommand = parseTaskCommand(transcript);
    if (taskCommand) {
      return {
        ...taskCommand,
        originalTranscript: transcript,
        speechConfidence: confidence
      };
    }

    // No recognized command
    return {
      type: 'unknown',
      action: 'none',
      originalTranscript: transcript,
      speechConfidence: confidence,
      confidence: 'low',
      error: 'Command not recognized'
    };
  }, [parseShoppingListCommand, parseTaskCommand]);

  const executeCommand = useCallback(async (command, options = {}) => {
    const { onAddGrocery, onAddTask, onCompleteTask } = options;
    
    console.log('⚡ Executing voice command:', command);

    try {
      switch (command.type) {
        case 'shopping_list':
          if (command.action === 'add' && onAddGrocery) {
            // Random chance for special styling - same logic as manual input
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            let shouldSpecial = !isMobile && Math.random() < 0.75; // 75% chance for special styling on desktop
            
            let bgColor = null;
            let bgPattern = null;
            
            if (shouldSpecial) {
              const SPECIAL_COLORS = ["#5398cb", "#6d3231", "#48af55", "#0b3d42", "#caccad"];
              const BACKGROUND_PATTERNS = [
                "/watermarks/Bowl.svg",
                "/watermarks/Cheese.svg", 
                "/watermarks/Lemons.svg",
                "/watermarks/Lettuce.svg",
                "/watermarks/Strawberries.svg"
              ];
              
              bgColor = SPECIAL_COLORS[Math.floor(Math.random() * SPECIAL_COLORS.length)];
              bgPattern = BACKGROUND_PATTERNS[Math.floor(Math.random() * BACKGROUND_PATTERNS.length)];
            }
            
            // Create a properly structured grocery item object
            const newGroceryItem = {
              id: Date.now(),
              text: command.item,
              addedAt: Date.now(),
              done: false,
              checked: false,
              special: shouldSpecial,
              bgColor,
              bgPattern,
            };
            
            await onAddGrocery(newGroceryItem);
            return {
              success: true,
              message: `Added "${command.item}" to shopping list`
            };
          }
          break;

        case 'task':
          if (command.action === 'add' && onAddTask) {
            const newTask = {
              text: command.task,
              completed: false,
              createdAt: new Date().toISOString()
            };
            await onAddTask(newTask);
            return {
              success: true,
              message: `Added task "${command.task}"`
            };
          } else if (command.action === 'complete' && onCompleteTask) {
            // This would require finding the task by description
            // For now, just return a message
            return {
              success: false,
              message: `Task completion by voice not yet implemented`
            };
          }
          break;

        case 'unknown':
        default:
          return {
            success: false,
            message: command.error || 'Command not recognized'
          };
      }

      return {
        success: false,
        message: 'No handler available for this command'
      };

    } catch (error) {
      console.error('❌ Error executing voice command:', error);
      return {
        success: false,
        message: 'Error executing command'
      };
    }
  }, []);

  return {
    parseCommand,
    executeCommand,
    parseShoppingListCommand,
    parseTaskCommand
  };
}