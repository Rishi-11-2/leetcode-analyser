function injectScript(file_path, tag) {
  let node = document.getElementsByTagName(tag)[0];
  if (!node) {
    node = document.head || document.documentElement;
  }
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file_path);
  node.appendChild(script);
}

injectScript(chrome.runtime.getURL('page.js'), 'body');

window.addEventListener("message", function(event) {
  if (event.data && event.data.type === "leetcodeCodeExtracted") {
    console.log("Content script received message from page.js:", event.data.code);
    chrome.runtime.sendMessage({ action: "codeExtracted", code: event.data.code });
  }
});
