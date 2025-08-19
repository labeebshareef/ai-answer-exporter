import { ExportSettings, DEFAULT_SETTINGS } from '../types';

export class SettingsManager {
  static async getSettings(): Promise<ExportSettings> {
    try {
      const result = await chrome.storage.sync.get('exportSettings');
      return { ...DEFAULT_SETTINGS, ...result.exportSettings };
    } catch (error) {
      console.warn('Failed to get settings from storage:', error);
      return DEFAULT_SETTINGS;
    }
  }

  static async setSettings(settings: Partial<ExportSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await chrome.storage.sync.set({ exportSettings: newSettings });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  static async resetSettings(): Promise<void> {
    try {
      await chrome.storage.sync.set({ exportSettings: DEFAULT_SETTINGS });
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  }
}