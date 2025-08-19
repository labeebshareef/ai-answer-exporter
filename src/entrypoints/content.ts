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
            margin-top: 16px;
            margin-bottom: 16px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            padding: 0 4px;
            justify-content: flex-start;
            align-items: center;
            opacity: 0;
            transform: translateY(10px);
            animation: fadeInUp 0.5s ease-out forwards;
          `;
          
          // Add CSS animation keyframes if not already present
          if (!document.head.querySelector('#ai-export-animations')) {
            const style = document.createElement('style');
            style.id = 'ai-export-animations';
            style.textContent = `
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `;
            document.head.appendChild(style);
          }
          
          // PDF Export Button
          const pdfButton = document.createElement('button');
          pdfButton.innerHTML = '📄 Download PDF';
          pdfButton.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            position: relative;
            overflow: hidden;
            min-width: 140px;
            justify-content: center;
          `;
          
          pdfButton.onmouseover = () => {
            pdfButton.style.transform = 'translateY(-2px) scale(1.02)';
            pdfButton.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
            pdfButton.style.background = 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)';
          };
          
          pdfButton.onmouseout = () => {
            pdfButton.style.transform = 'translateY(0) scale(1)';
            pdfButton.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            pdfButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          };
          
          pdfButton.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            try {
              pdfButton.innerHTML = '⏳ Generating...';
              pdfButton.disabled = true;
              pdfButton.style.background = 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)';
              pdfButton.style.cursor = 'not-allowed';
              pdfButton.style.transform = 'scale(0.98)';
              
              await ExportManager.exportToPDF(answerElement);
              
              pdfButton.innerHTML = '✅ Downloaded!';
              pdfButton.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
              pdfButton.style.cursor = 'default';
              setTimeout(() => {
                pdfButton.innerHTML = '📄 Download PDF';
                pdfButton.disabled = false;
                pdfButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                pdfButton.style.cursor = 'pointer';
                pdfButton.style.transform = 'scale(1)';
              }, 2000);
            } catch (error) {
              console.error('PDF export failed:', error);
              pdfButton.innerHTML = '❌ Failed';
              pdfButton.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
              setTimeout(() => {
                pdfButton.innerHTML = '📄 Download PDF';
                pdfButton.disabled = false;
                pdfButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                pdfButton.style.cursor = 'pointer';
                pdfButton.style.transform = 'scale(1)';
              }, 2000);
            }
          };
          
          // Print Button
          const printButton = document.createElement('button');
          printButton.innerHTML = '🖨️ Print';
          printButton.style.cssText = `
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
            position: relative;
            overflow: hidden;
            min-width: 120px;
            justify-content: center;
          `;
          
          printButton.onmouseover = () => {
            printButton.style.transform = 'translateY(-2px) scale(1.02)';
            printButton.style.boxShadow = '0 8px 25px rgba(240, 147, 251, 0.6)';
            printButton.style.background = 'linear-gradient(135deg, #e879f9 0%, #ec4899 100%)';
          };
          
          printButton.onmouseout = () => {
            printButton.style.transform = 'translateY(0) scale(1)';
            printButton.style.boxShadow = '0 4px 15px rgba(240, 147, 251, 0.4)';
            printButton.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
          };
          
          printButton.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            try {
              printButton.innerHTML = '⏳ Printing...';
              printButton.disabled = true;
              printButton.style.background = 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)';
              printButton.style.cursor = 'not-allowed';
              printButton.style.transform = 'scale(0.98)';
              
              await ExportManager.printContent(answerElement);
              
              printButton.innerHTML = '✅ Sent to Print!';
              printButton.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
              setTimeout(() => {
                printButton.innerHTML = '🖨️ Print';
                printButton.disabled = false;
                printButton.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                printButton.style.cursor = 'pointer';
                printButton.style.transform = 'scale(1)';
              }, 2000);
            } catch (error) {
              console.error('Print failed:', error);
              printButton.innerHTML = '❌ Failed';
              printButton.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
              setTimeout(() => {
                printButton.innerHTML = '🖨️ Print';
                printButton.disabled = false;
                printButton.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                printButton.style.cursor = 'pointer';
                printButton.style.transform = 'scale(1)';
              }, 2000);
            }
          };
          
          buttonsContainer.appendChild(pdfButton);
          buttonsContainer.appendChild(printButton);
          
          // Insert buttons after the answer element (not inside it)
          // Use insertAdjacentElement for better positioning control
          if (answerElement.nextSibling) {
            answerElement.parentNode?.insertBefore(buttonsContainer, answerElement.nextSibling);
          } else {
            answerElement.parentNode?.appendChild(buttonsContainer);
          }
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