(function() {
    console.log("page.js loaded in page context");
    
    function extractCode() {
        if (window.monaco?.editor && typeof window.monaco.editor.getModels === 'function') {
          const models = window.monaco.editor.getModels();
          // Find the model with code (adjust your conditions as needed)
          const codeModel = models.find(model => 
            model.uri?.path.includes('/1') || // Example check: adjust for your case
            model.getModeId() === 'python'     // Example: checking for Python code
          );
          
          if (codeModel) {
            const code = codeModel.getValue();
            window.postMessage({ type: "leetcodeCodeExtracted", code }, "*");
          } else {
            window.postMessage({ type: "leetcodeCodeExtracted", code: "Code model not found." }, "*");
          }
        } else {
          window.postMessage({ type: "leetcodeCodeExtracted", code: "Monaco Editor not loaded." }, "*");
        }
    }
    
    function waitForEditor(callback) {
        const checkInterval = setInterval(() => {
          if (window.monaco?.editor && window.monaco.editor.getModels().length > 0) {
            clearInterval(checkInterval);
            callback();
          }
        }, 500);
    }
    
    // Listen for the custom event dispatched by the popup.
    window.addEventListener('triggerCodeExtraction', () => {
        waitForEditor(extractCode); // Wait for the editor to load before extracting code.
    });
})();
