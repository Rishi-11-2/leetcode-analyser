# LeetCode Code Analyser

A Chrome extension that extracts code from LeetCode's code editor and analyzes its time and space complexity using AI models.

## Features

- **Code Extraction**: Automatically extracts code from LeetCode's Monaco editor
- **AI-Powered Analysis**: Analyzes time and space complexity using various AI providers:
  - OpenAI
  - Google Gemini
  - Hugging Face
- **User Authentication**: Secure login via Google OAuth
- **Customizable**: Change AI providers and models anytime
- **Simple UI**: Clean, user-friendly interface

## Installation

### From Chrome Web Store (Coming Soon)
- Visit the [Chrome Web Store](#) and add the extension

### Manual Installation
1. Clone this repository:
   ```
   git clone https://github.com/Rishi-11-2/leetcode-analyser.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the repository folder
5. The extension should now appear in your browser toolbar

## Usage

1. **Log In**: Open the extension and log in with your Google account
2. **Set up API Credentials**:
   - Enter your API key for your chosen provider (OpenAI, Gemini, or Hugging Face)
   - Specify the model name (e.g., `gpt-3.5-turbo`, `gemini-pro`, etc.)
   - Select the provider from the dropdown
3. **Analyze Code**:
   - Navigate to any LeetCode problem page with your solution
   - Click the extension icon in your browser toolbar
   - Click "Analyze Complexity"
   - View the time and space complexity analysis results

## Backend Service

The extension is powered by a FastAPI backend service located in the `ai_complexity_analysis` folder:

1. **Backend Setup**:
   ```
   cd ai_complexity_analysis
   pip install -r requirements.txt
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```

2. **API Endpoint**:
   - `/analyze` - POST endpoint for code analysis
   - Hosted on Render at https://ai-complexity-analysis.onrender.com/analyze

## Project Structure

```
leetcode-analyser/
├── manifest.json            # Chrome extension manifest
├── content.js               # Content script for communication
├── page.js                  # Page script for code extraction
├── popup.html               # Extension popup UI
├── popup.css                # Styling for popup
├── popup.js                 # Popup functionality
└── ai_complexity_analysis/  # Backend service
    ├── app.py               # FastAPI application
    └── requirements.txt     # Python dependencies
```

## How It Works

1. The extension injects a script into LeetCode pages
2. When triggered, it extracts code from the Monaco editor
3. The code is sent to the FastAPI backend along with API credentials
4. The backend uses the specified AI provider to analyze complexity
5. Results are displayed in the extension popup

## Privacy

- API keys are stored securely in Chrome's sync storage
- Code is processed server-side but not stored
- Authentication is handled via Google OAuth

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
