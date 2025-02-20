document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("loginBtn");
  const userInfoDiv = document.getElementById("userInfo");
  const credentialsDiv = document.getElementById("credentials");
  const extractBtn = document.getElementById("extractBtn");
  const changeCredentialsBtn = document.getElementById("changeCredentialsBtn"); // New button for changing credentials
  const resultDisplay = document.getElementById("result");
  const apiKeyInput = document.getElementById("apiKeyInput");
  const modelNameInput = document.getElementById("modelNameInput");
  const providerSelect = document.getElementById("providerSelect");
  const saveCredentialsBtn = document.getElementById("saveCredentialsBtn");

  credentialsDiv.style.display = "none";
  extractBtn.style.display = "none";
  changeCredentialsBtn.style.display = "none";

  function showLoginMessage(message, duration) {
    userInfoDiv.style.display = "block";
    userInfoDiv.textContent = message;
    setTimeout(() => {
      const closeBtn = document.createElement("span");
      closeBtn.textContent = "×";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.marginLeft = "10px";
      closeBtn.style.color = "red"; 
      closeBtn.addEventListener("click", function () {
        userInfoDiv.style.display = "none";
      });
      if (!document.getElementById("closeLoginMsg")) {
        closeBtn.id = "closeLoginMsg";
        userInfoDiv.appendChild(closeBtn);
      }
    }, duration);
  }

  chrome.identity.getAuthToken({ interactive: false }, function(token) {
    if (token) {
      showLoginMessage("Logged in successfully!", 1000);
      loginBtn.style.display = "none";
      chrome.storage.sync.get(["apiKey", "modelName", "provider"], function(data) {
        if (data.apiKey && data.modelName && data.provider) {
          providerSelect.value = data.provider;
          credentialsDiv.style.display = "none";
          extractBtn.style.display = "block";
          changeCredentialsBtn.style.display = "block";
        } else {
          credentialsDiv.style.display = "block";
          extractBtn.style.display = "none";
          changeCredentialsBtn.style.display = "none";
        }
      });
    } else {
      userInfoDiv.textContent = "Please log in to continue.";
      loginBtn.style.display = "block";
    }
  });

  loginBtn.addEventListener("click", function () {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError || !token) {
        userInfoDiv.textContent = "Login failed. Please try again.";
        return;
      }
      showLoginMessage("Logged in successfully!", 5000);
      loginBtn.style.display = "none";
      chrome.storage.sync.get(["apiKey", "modelName", "provider"], function(data) {
        if (data.apiKey && data.modelName && data.provider) {
          providerSelect.value = data.provider;
          credentialsDiv.style.display = "none";
          extractBtn.style.display = "block";
          changeCredentialsBtn.style.display = "block";
        } else {
          credentialsDiv.style.display = "block";
          extractBtn.style.display = "none";
          changeCredentialsBtn.style.display = "none";
        }
      });
    });
  });

  saveCredentialsBtn.addEventListener("click", function() {
    const apiKey = apiKeyInput.value.trim();
    const modelName = modelNameInput.value.trim();
    const provider = providerSelect.value.trim();
    if (!apiKey || !modelName || !provider) {
      resultDisplay.textContent = "Please enter API Key, Model Name, and select a Provider.";
      return;
    }
    chrome.storage.sync.set({ apiKey: apiKey, modelName: modelName, provider: provider }, function() {
      resultDisplay.textContent = "Credentials saved successfully!";
      credentialsDiv.style.display = "none";
      extractBtn.style.display = "block";
      changeCredentialsBtn.style.display = "block";
    });
  });

  changeCredentialsBtn.addEventListener("click", function () {
    credentialsDiv.style.display = "block";
    extractBtn.style.display = "none";
    changeCredentialsBtn.style.display = "none";
  });

  extractBtn.addEventListener("click", function () {
    chrome.storage.sync.get(["apiKey", "modelName", "provider"], function(data) {
      if (!data.apiKey || !data.modelName || !data.provider) {
        resultDisplay.textContent = "Credentials not found. Please set your API key, model name, and provider.";
        return;
      }
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            function: extractCode 
          },
          (injectionResults) => {
            if (injectionResults && injectionResults[0] && injectionResults[0].result) {
              let extractedCode = injectionResults[0].result;
              sendCodeToAPI(extractedCode, data.apiKey, data.modelName, data.provider);
            } else {
              resultDisplay.textContent = "Failed to extract code.";
            }
          }
        );
      });
    });
  });

  function sendCodeToAPI(code, apiKey, modelName, provider) {
    console.log(code);
    // const apiUrl = "http://localhost:8000/analyze"; 
    const apiUrl = "https://ai-complexity-analysis.onrender.com/analyze"; 
    const payload = {
      code: code,
      api_key: apiKey,
      model_name: modelName,
      provider: provider
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        resultDisplay.textContent = data.result;
      })
      .catch(error => {
        console.error("Error sending code to API:", error);
        resultDisplay.textContent = "Error sending code to API.";
      });
  }
});

function extractCode() {
  function removeLineNumbers(text) {
    return text
      .split('\n')
      .filter(line => !/^\s*\d+\s*$/.test(line))
      .map(line => line.replace(/^\s*\d+\s+/, ''))
      .join('\n');
  }

  let elem, rawCode;

  elem = document.querySelector(".monaco-editor");
  if (elem && elem.innerText.trim()) {
    rawCode = elem.innerText;
    return removeLineNumbers(rawCode);
  }
  
  elem = document.getElementById("code");
  if (elem && elem.innerText.trim() && elem.innerText.trim() !== "code") {
    rawCode = elem.innerText;
    return removeLineNumbers(rawCode);
  }

  elem = document.querySelector(".CodeMirror-code");
  if (elem && elem.innerText.trim()) {
    rawCode = elem.innerText;
    return removeLineNumbers(rawCode);
  }
  
  
  return "No code found.";
}
