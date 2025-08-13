import { useState } from 'react';
import { useHomeAssistant } from '../hooks/useHomeAssistant';
import DeviceCard from '../components/home/DeviceCard';
import ModernWidgetGrid from '../components/home/ModernWidgetGrid';

export default function TestDragDrop() {
  const { devices, loading, error, toggleDevice } = useHomeAssistant();

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  // Create simple widgets from devices
  const lights = devices?.filter(d => d.entity_id.startsWith('light.')) || [];
  
  const [widgets, setWidgets] = useState(() => 
    lights.slice(0, 4).map((light, index) => ({
      id: `widget-${light.entity_id}`,
      type: 'device',
      light: light, // Store light data for re-rendering
      component: (
        <DeviceCard
          key={light.entity_id}
          device={light}
          onToggle={toggleDevice}
          onLongPress={(id) => console.log('Long press:', id)}
        />
      )
    }))
  );

  const handleDragEnd = (result) => {
    console.log('Drag ended:', result);
    if (!result.destination) return;
    
    console.log('Moved from', result.source.index, 'to', result.destination.index);
    
    // Update the widgets array with new order
    if (result.newWidgets) {
      setWidgets(result.newWidgets);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Drag & Drop Test</h1>
      
      <div className="mb-4 p-2 bg-blue-100 rounded">
        Testing with {widgets.length} draggable device widgets
      </div>

      {widgets.length > 0 ? (
        <ModernWidgetGrid
          widgets={widgets}
          onDragEnd={handleDragEnd}
          onWidgetPress={(widget) => console.log('Widget press:', widget.id)}
          onWidgetLongPress={(widget) => console.log('Widget long press:', widget.id)}
        />
      ) : (
        <div>No widgets to test</div>
      )}
    </div>
  );
}