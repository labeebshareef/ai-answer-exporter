import React, { useState, useEffect } from 'react';
import { ExportSettings, DEFAULT_SETTINGS, FONT_FAMILIES } from '../types';
import { SettingsManager } from '../utils/settings';
import '../style.css';

function OptionsPage() {
  const [settings, setSettings] = useState<ExportSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await SettingsManager.getSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      await SettingsManager.setSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const resetSettings = async () => {
    try {
      await SettingsManager.resetSettings();
      setSettings(DEFAULT_SETTINGS);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  };

  const updateSetting = <K extends keyof ExportSettings>(
    key: K,
    value: ExportSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              AI Answer Exporter Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Customize how your AI responses are exported as PDF or printed
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Font Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Typography</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => updateSetting('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {FONT_FAMILIES.map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size
                  </label>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', e.target.value as 'small' | 'medium' | 'large')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="small">Small (12px)</option>
                    <option value="medium">Medium (14px)</option>
                    <option value="large">Large (16px)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Page Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Page Layout</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Format
                  </label>
                  <select
                    value={settings.pageFormat}
                    onChange={(e) => updateSetting('pageFormat', e.target.value as 'a4' | 'letter' | 'legal')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Margins
                  </label>
                  <select
                    value={settings.margins}
                    onChange={(e) => updateSetting('margins', e.target.value as 'narrow' | 'normal' | 'wide')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="narrow">Narrow</option>
                    <option value="normal">Normal</option>
                    <option value="wide">Wide</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Theme Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Theme</h2>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="darkMode"
                  checked={settings.darkMode}
                  onChange={(e) => updateSetting('darkMode', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-900">
                  Export in dark mode
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
              
              <div 
                className="border border-gray-300 rounded-lg p-4"
                style={{
                  fontFamily: settings.fontFamily,
                  fontSize: settings.fontSize === 'small' ? '12px' : settings.fontSize === 'medium' ? '14px' : '16px',
                  backgroundColor: settings.darkMode ? '#1a1a1a' : '#ffffff',
                  color: settings.darkMode ? '#ffffff' : '#000000'
                }}
              >
                <h3 className="font-bold mb-2">Sample AI Response</h3>
                <p className="mb-2">This is how your exported content will look with the current settings.</p>
                <ul className="list-disc list-inside mb-2">
                  <li>Bullet point example</li>
                  <li>Another bullet point</li>
                </ul>
                <pre className="bg-gray-100 p-2 rounded text-sm font-mono">
                  {`console.log("Code block example");`}
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                onClick={resetSettings}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                Reset to Defaults
              </button>
              
              <div className="flex items-center gap-3">
                {saved && (
                  <span className="text-green-600 text-sm font-medium">
                    ✅ Settings saved!
                  </span>
                )}
                <button
                  onClick={saveSettings}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-1">1. Visit AI Websites</h4>
              <p>Go to ChatGPT, Claude.ai, or Perplexity.ai</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">2. Find Export Buttons</h4>
              <p>Look for PDF and Print buttons below AI responses</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">3. Export with Style</h4>
              <p>Your custom settings will be applied automatically</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OptionsPage;