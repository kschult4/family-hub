// Fallback for browsers that don't support ES modules
if (!('noModule' in HTMLScriptElement.prototype)) {
  console.warn('Browser does not support ES modules. Please use a modern browser.');
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>Browser Not Supported</h1>
      <p>This application requires a modern browser that supports ES modules.</p>
      <p>Please try:</p>
      <ul style="display: inline-block; text-align: left;">
        <li>Chromium (recommended for Raspberry Pi)</li>
        <li>Firefox ESR</li>
        <li>Chrome</li>
      </ul>
      <p>Or update your current browser to the latest version.</p>
    </div>
  `;
}