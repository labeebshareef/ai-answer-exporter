import React from 'react';
import '../style.css';

function App() {
  const openOptions = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  };

  const openGitHub = () => {
    chrome.tabs.create({ url: 'https://github.com/labeebshareef/ai-answer-exporter' });
  };

  return (
    <div className="w-80 p-6 bg-white">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          AI Answer Exporter
        </h1>
        <p className="text-sm text-gray-600">
          Export AI responses as PDF or print with preserved formatting
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">✨ How it works</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Visit ChatGPT, Claude.ai, or Perplexity.ai</li>
            <li>• Look for PDF and Print buttons below AI responses</li>
            <li>• Customize export settings in options</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={openOptions}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            ⚙️ Open Settings
          </button>

          <button
            onClick={openGitHub}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            📱 GitHub Repository
          </button>
        </div>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Supports ChatGPT • Claude.ai • Perplexity.ai
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;