import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function WidgetGrid({ 
  widgets = [], 
  onDragEnd, 
  onWidgetPress,
  onWidgetLongPress 
}) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="widget-grid" direction="vertical">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 p-2 sm:p-4 min-h-[200px] transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-gray-50' : ''
            }`}
          >
            {widgets.map((widget, index) => (
              <Draggable key={widget.id} draggableId={widget.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onWidgetPress?.(widget)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      onWidgetLongPress?.(widget);
                    }}
                    onTouchStart={(e) => {
                      const touchStartTime = Date.now();
                      const touchHandler = () => {
                        if (Date.now() - touchStartTime > 500) {
                          onWidgetLongPress?.(widget);
                        }
                      };
                      setTimeout(touchHandler, 500);
                    }}
                    className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-95 ${
                      snapshot.isDragging ? 'rotate-2 shadow-xl z-50' : ''
                    }`}
                    style={{
                      ...provided.draggableProps.style,
                      transform: snapshot.isDragging 
                        ? `${provided.draggableProps.style?.transform} rotate(2deg)` 
                        : provided.draggableProps.style?.transform
                    }}
                  >
                    {widget.component}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}