// Very simple test to isolate the issue
export default function SimpleTest() {
  console.log('SimpleTest rendering...');
  
  try {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Simple Test</h1>
        <p>If you can see this, basic rendering works.</p>
      </div>
    );
  } catch (error) {
    console.error('Error in SimpleTest:', error);
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }
}