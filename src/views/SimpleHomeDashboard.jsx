import { useHomeAssistant } from '../hooks/useHomeAssistant';

export default function SimpleHomeDashboard() {
  console.log('SimpleHomeDashboard rendering...');
  
  const { devices, scenes, loading, error } = useHomeAssistant();
  
  console.log('Hook results:', { devices, scenes, loading, error });

  if (loading) {
    return <div className="p-4">Loading devices...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Home Dashboard - Debug</h1>
      <p>Devices: {devices.length}</p>
      <p>Scenes: {scenes.length}</p>
      
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Devices:</h2>
        {devices.slice(0, 3).map(device => (
          <div key={device.entity_id} className="p-2 border rounded mb-2">
            <p className="font-medium">{device.attributes?.friendly_name}</p>
            <p className="text-sm text-gray-600">{device.entity_id} - {device.state}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Scenes:</h2>
        {scenes.slice(0, 3).map(scene => (
          <div key={scene.entity_id} className="p-2 border rounded mb-2">
            <p className="font-medium">{scene.attributes?.friendly_name}</p>
            <p className="text-sm text-gray-600">{scene.entity_id} - {scene.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
}