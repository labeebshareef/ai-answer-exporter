export default defineContentScript({
  matches: [
    'https://chat.openai.com/*',
    'https://claude.ai/*',
    'https://www.perplexity.ai/*'
  ],
  main() {
    console.log('AI Answer Exporter: Content script loaded');
    
    // Import required utilities
    import('../utils/websiteDetector').then(({ WebsiteDetector }) => {
      import('../utils/exportManager').then(({ ExportManager }) => {
        
        let injectionAttempts = 0;
        const maxAttempts = 10;
        
        function injectExportButtons() {
          injectionAttempts++;
          console.log(`AI Answer Exporter: Injection attempt ${injectionAttempts}`);
          
          const answers = WebsiteDetector.findAnswerElements();
          console.log(`Found ${answers.length} answer elements`);
          
          answers.forEach(answer => {
            if (!answer.element.querySelector('.ai-export-buttons')) {
              createExportButtons(answer.element);
            }
          });
          
          // Continue trying for a few seconds if no answers found
          if (answers.length === 0 && injectionAttempts < maxAttempts) {
            setTimeout(injectExportButtons, 1000);
          }
        }
        
        function createExportButtons(answerElement: HTMLElement) {
          const buttonsContainer = document.createElement('div');
          buttonsContainer.className = 'ai-export-buttons';
          buttonsContainer.style.cssText = `
            margin-top: 12px;
            margin-bottom: 12px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          `;
          
          // PDF Export Button
          const pdfButton = document.createElement('button');
          pdfButton.innerHTML = '📄 Download PDF';
          pdfButton.style.cssText = `
            background: #4285f4;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
          `;
          
          pdfButton.onmouseover = () => {
            pdfButton.style.backgroundColor = '#3367d6';
          };
          
          pdfButton.onmouseout = () => {
            pdfButton.style.backgroundColor = '#4285f4';
          };
          
          pdfButton.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            try {
              pdfButton.innerHTML = '⏳ Generating...';
              pdfButton.disabled = true;
              
              await ExportManager.exportToPDF(answerElement);
              
              pdfButton.innerHTML = '✅ Downloaded!';
              setTimeout(() => {
                pdfButton.innerHTML = '📄 Download PDF';
                pdfButton.disabled = false;
              }, 2000);
            } catch (error) {
              console.error('PDF export failed:', error);
              pdfButton.innerHTML = '❌ Failed';
              setTimeout(() => {
                pdfButton.innerHTML = '📄 Download PDF';
                pdfButton.disabled = false;
              }, 2000);
            }
          };
          
          // Print Button
          const printButton = document.createElement('button');
          printButton.innerHTML = '🖨️ Print';
          printButton.style.cssText = `
            background: #34a853;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
          `;
          
          printButton.onmouseover = () => {
            printButton.style.backgroundColor = '#2d8e47';
          };
          
          printButton.onmouseout = () => {
            printButton.style.backgroundColor = '#34a853';
          };
          
          printButton.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            try {
              await ExportManager.printContent(answerElement);
            } catch (error) {
              console.error('Print failed:', error);
            }
          };
          
          buttonsContainer.appendChild(pdfButton);
          buttonsContainer.appendChild(printButton);
          
          // Insert buttons after the answer element
          answerElement.appendChild(buttonsContainer);
        }
        
        // Initial injection
        setTimeout(injectExportButtons, 1000);
        
        // Watch for new content (for dynamic loading)
        const observer = new MutationObserver(() => {
          setTimeout(injectExportButtons, 500);
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
          observer.disconnect();
        });
      });
    });
  }
});