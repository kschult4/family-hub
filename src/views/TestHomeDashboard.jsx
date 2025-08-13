// Minimal test component to isolate the issue
export default function TestHomeDashboard() {
  console.log('TestHomeDashboard rendering');
  
  try {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Test Home Dashboard</h1>
        <p>This is a test component to verify basic rendering works.</p>
      </div>
    );
  } catch (error) {
    console.error('Error in TestHomeDashboard:', error);
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }
}