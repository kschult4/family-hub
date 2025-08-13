import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableWidget({ widget, onWidgetPress, onWidgetLongPress }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-move transition-all duration-200 ${
        isDragging ? 'z-50 rotate-3 scale-105' : 'hover:scale-102'
      }`}
      onClick={() => onWidgetPress?.(widget)}
      onContextMenu={(e) => {
        e.preventDefault();
        onWidgetLongPress?.(widget);
      }}
    >
      {widget.component}
    </div>
  );
}

export default function ModernWidgetGrid({ 
  widgets = [], 
  onDragEnd, 
  onWidgetPress,
  onWidgetLongPress 
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex(widget => widget.id === active.id);
      const newIndex = widgets.findIndex(widget => widget.id === over.id);
      
      const newWidgets = arrayMove(widgets, oldIndex, newIndex);
      
      // Call the parent's drag end handler with the new order
      onDragEnd?.({
        source: { index: oldIndex },
        destination: { index: newIndex },
        draggableId: active.id,
        newWidgets
      });
    }
  }

  if (widgets.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No widgets to display</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={widgets.map(w => w.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 p-2">
          {widgets.map((widget) => (
            <SortableWidget
              key={widget.id}
              widget={widget}
              onWidgetPress={onWidgetPress}
              onWidgetLongPress={onWidgetLongPress}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}