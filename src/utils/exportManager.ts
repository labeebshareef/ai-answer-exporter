import { ExportSettings, FONT_SIZES, PAGE_FORMATS, MARGINS } from '../types';
import { SettingsManager } from './settings';

export class ExportManager {
  static async exportToPDF(content: HTMLElement): Promise<void> {
    try {
      // Dynamic import for html2pdf
      const html2pdf = await import('html2pdf.js');
      const settings = await SettingsManager.getSettings();
      const processedContent = this.processContentForExport(content, settings);
      
      const opt = {
        margin: MARGINS[settings.margins],
        filename: `ai-answer-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true 
        },
        jsPDF: { 
          unit: 'mm', 
          format: settings.pageFormat,
          orientation: 'portrait' 
        }
      };

      await html2pdf.default().set(opt).from(processedContent).save();
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  }

  static async printContent(content: HTMLElement): Promise<void> {
    try {
      const settings = await SettingsManager.getSettings();
      const processedContent = this.processContentForExport(content, settings);
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups for this site to use the print feature.');
        return;
      }

      const printDocument = printWindow.document;
      printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>AI Answer Export</title>
          <style>${this.getExportStyles(settings)}</style>
        </head>
        <body>
          ${processedContent.outerHTML}
        </body>
        </html>
      `);
      
      printDocument.close();
      printWindow.focus();
      
      // Wait for content to load, then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } catch (error) {
      console.error('Print failed:', error);
      alert('Failed to open print dialog. Please try again.');
    }
  }

  private static processContentForExport(content: HTMLElement, settings: ExportSettings): HTMLElement {
    // Clone the content to avoid modifying the original
    const clonedContent = content.cloneNode(true) as HTMLElement;
    
    // Remove any existing export buttons
    const existingButtons = clonedContent.querySelectorAll('.ai-export-buttons');
    existingButtons.forEach(btn => btn.remove());
    
    // Apply export-specific styling
    clonedContent.style.fontFamily = settings.fontFamily;
    clonedContent.style.fontSize = FONT_SIZES[settings.fontSize];
    clonedContent.style.lineHeight = '1.6';
    clonedContent.style.maxWidth = '100%';
    clonedContent.style.margin = '0';
    clonedContent.style.padding = '20px';
    
    if (settings.darkMode) {
      clonedContent.style.backgroundColor = '#1a1a1a';
      clonedContent.style.color = '#ffffff';
    } else {
      clonedContent.style.backgroundColor = '#ffffff';
      clonedContent.style.color = '#000000';
    }

    // Style code blocks
    const codeBlocks = clonedContent.querySelectorAll('pre, code');
    codeBlocks.forEach(block => {
      const element = block as HTMLElement;
      element.style.fontFamily = 'Courier New, monospace';
      element.style.backgroundColor = settings.darkMode ? '#2d2d2d' : '#f5f5f5';
      element.style.padding = '10px';
      element.style.borderRadius = '4px';
      element.style.overflow = 'auto';
    });

    // Style lists
    const lists = clonedContent.querySelectorAll('ul, ol');
    lists.forEach(list => {
      const element = list as HTMLElement;
      element.style.paddingLeft = '20px';
      element.style.marginBottom = '10px';
    });

    // Style tables
    const tables = clonedContent.querySelectorAll('table');
    tables.forEach(table => {
      const element = table as HTMLElement;
      element.style.borderCollapse = 'collapse';
      element.style.width = '100%';
      element.style.marginBottom = '15px';
      
      const cells = element.querySelectorAll('td, th');
      cells.forEach(cell => {
        const cellElement = cell as HTMLElement;
        cellElement.style.border = '1px solid #ccc';
        cellElement.style.padding = '8px';
      });
    });

    // Style headings
    const headings = clonedContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      const element = heading as HTMLElement;
      element.style.marginTop = '20px';
      element.style.marginBottom = '10px';
      element.style.fontWeight = 'bold';
    });

    return clonedContent;
  }

  private static getExportStyles(settings: ExportSettings): string {
    return `
      body {
        font-family: ${settings.fontFamily};
        font-size: ${FONT_SIZES[settings.fontSize]};
        line-height: 1.6;
        margin: 0;
        padding: 20px;
        background-color: ${settings.darkMode ? '#1a1a1a' : '#ffffff'};
        color: ${settings.darkMode ? '#ffffff' : '#000000'};
      }
      
      pre, code {
        font-family: 'Courier New', monospace;
        background-color: ${settings.darkMode ? '#2d2d2d' : '#f5f5f5'};
        padding: 10px;
        border-radius: 4px;
        overflow: auto;
      }
      
      ul, ol {
        padding-left: 20px;
        margin-bottom: 10px;
      }
      
      table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 15px;
      }
      
      td, th {
        border: 1px solid #ccc;
        padding: 8px;
      }
      
      h1, h2, h3, h4, h5, h6 {
        margin-top: 20px;
        margin-bottom: 10px;
        font-weight: bold;
      }
      
      @media print {
        body {
          margin: 0;
          padding: 20px;
        }
      }
    `;
  }
}