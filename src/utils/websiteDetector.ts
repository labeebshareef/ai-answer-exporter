import { AIAnswerElement } from '../types';

export class WebsiteDetector {
  static detectWebsite(): 'chatgpt' | 'claude' | 'perplexity' | null {
    const hostname = window.location.hostname;
    
    if (hostname.includes('chat.openai.com')) {
      return 'chatgpt';
    } else if (hostname.includes('claude.ai')) {
      return 'claude';
    } else if (hostname.includes('perplexity.ai')) {
      return 'perplexity';
    }
    
    return null;
  }

  static findAnswerElements(): AIAnswerElement[] {
    const website = this.detectWebsite();
    if (!website) return [];

    switch (website) {
      case 'chatgpt':
        return this.findChatGPTAnswers(website);
      case 'claude':
        return this.findClaudeAnswers(website);
      case 'perplexity':
        return this.findPerplexityAnswers(website);
      default:
        return [];
    }
  }

  private static findChatGPTAnswers(website: 'chatgpt'): AIAnswerElement[] {
    // ChatGPT answer containers - looking for assistant messages
    const answerElements = document.querySelectorAll([
      '[data-testid^="conversation-turn-"]',
      '[data-message-author-role="assistant"]',
      '.group\\/conversation-turn',
      '[data-testid="bot-message"]'
    ].join(', '));
    const answers: AIAnswerElement[] = [];

    answerElements.forEach(el => {
      const element = el as HTMLElement;
      if (element && !element.querySelector('.ai-export-buttons')) {
        answers.push({
          element,
          content: element.innerText || '',
          website
        });
      }
    });

    return answers;
  }

  private static findClaudeAnswers(website: 'claude'): AIAnswerElement[] {
    // Claude answer containers
    const answerElements = document.querySelectorAll([
      '[data-testid="message"]',
      '.font-claude-message',
      '.prose',
      '[role="article"]',
      '.message-content'
    ].join(', '));
    const answers: AIAnswerElement[] = [];

    answerElements.forEach(el => {
      const element = el as HTMLElement;
      // Check if this is likely an assistant message and doesn't already have buttons
      if (element && element.closest('[data-is-streaming="false"]') && !element.querySelector('.ai-export-buttons')) {
        answers.push({
          element,
          content: element.innerText || '',
          website
        });
      }
    });

    return answers;
  }

  private static findPerplexityAnswers(website: 'perplexity'): AIAnswerElement[] {
    // Perplexity answer containers
    const answerElements = document.querySelectorAll([
      '.prose',
      '[data-testid="answer"]',
      '.answer-content',
      '.result-content',
      '[role="article"]'
    ].join(', '));
    const answers: AIAnswerElement[] = [];

    answerElements.forEach(el => {
      const element = el as HTMLElement;
      if (element && !element.querySelector('.ai-export-buttons')) {
        answers.push({
          element,
          content: element.innerText || '',
          website
        });
      }
    });

    return answers;
  }
}