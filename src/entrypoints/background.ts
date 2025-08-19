export default defineBackground(() => {
  console.log('AI Answer Exporter: Background script loaded');
  
  // Handle extension installation
  chrome.runtime.onInstalled.addListener((details) => {
    console.log('AI Answer Exporter: Extension installed/updated', details);
    
    // Initialize default settings on first install
    if (details.reason === 'install') {
      import('../utils/settings').then(({ SettingsManager }) => {
        SettingsManager.resetSettings();
      });
    }
  });

  // Handle messages from content scripts or popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background script received message:', message);
    
    switch (message.type) {
      case 'GET_SETTINGS':
        import('../utils/settings').then(({ SettingsManager }) => {
          SettingsManager.getSettings().then(settings => {
            sendResponse({ settings });
          });
        });
        return true; // Keep message channel open for async response
        
      case 'SET_SETTINGS':
        import('../utils/settings').then(({ SettingsManager }) => {
          SettingsManager.setSettings(message.settings).then(() => {
            sendResponse({ success: true });
          });
        });
        return true;
        
      case 'RESET_SETTINGS':
        import('../utils/settings').then(({ SettingsManager }) => {
          SettingsManager.resetSettings().then(() => {
            sendResponse({ success: true });
          });
        });
        return true;
        
      default:
        console.log('Unknown message type:', message.type);
    }
  });

  // Context menu for options page
  chrome.contextMenus.create({
    id: 'ai-exporter-options',
    title: 'AI Answer Exporter Options',
    contexts: ['page'],
    documentUrlPatterns: [
      'https://chat.openai.com/*',
      'https://claude.ai/*', 
      'https://www.perplexity.ai/*'
    ]
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'ai-exporter-options') {
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    }
  });
});