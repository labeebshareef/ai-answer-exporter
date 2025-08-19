export interface ExportSettings {
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  pageFormat: 'a4' | 'letter' | 'legal';
  margins: 'narrow' | 'normal' | 'wide';
  darkMode: boolean;
}

export interface AIAnswerElement {
  element: HTMLElement;
  content: string;
  website: 'chatgpt' | 'claude' | 'perplexity';
}

export const DEFAULT_SETTINGS: ExportSettings = {
  fontFamily: 'Arial',
  fontSize: 'medium',
  pageFormat: 'a4',
  margins: 'normal',
  darkMode: false,
};

export const FONT_FAMILIES = [
  'Arial',
  'Times New Roman', 
  'Roboto',
  'Helvetica',
  'Georgia',
  'Courier New'
];

export const FONT_SIZES = {
  small: '12px',
  medium: '14px', 
  large: '16px'
};

export const PAGE_FORMATS = {
  a4: [210, 297],
  letter: [216, 279],
  legal: [216, 356]
};

export const MARGINS = {
  narrow: [10, 10, 10, 10],
  normal: [20, 20, 20, 20],
  wide: [30, 30, 30, 30]
};