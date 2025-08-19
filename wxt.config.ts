import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  outDir: '.output',
  manifestVersion: 3,
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'AI Answer Exporter',
    description: 'Export AI responses as PDF or print with preserved formatting.',
    permissions: ['activeTab', 'storage', 'contextMenus'],
    host_permissions: [
      'https://chat.openai.com/*',
      'https://claude.ai/*',
      'https://www.perplexity.ai/*'
    ],
    action: {
      default_popup: 'popup.html',
      default_title: 'AI Answer Exporter'
    },
    icons: {
      '16': 'icons/icon-16.png',
      '48': 'icons/icon-48.png',
      '128': 'icons/icon-128.png'
    },
    options_page: 'options.html'
  }
});