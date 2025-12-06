export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (!text || text.length === 0) {
      throw new Error('No content to copy');
    }

    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback to execCommand for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (!success) {
      throw new Error('Copy command failed');
    }

    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

export const validateHtml = (html: string): boolean => {
  try {
    if (!html || typeof html !== 'string') return false;

    // Basic HTML validation
    const requiredTags = ['<html', '</html>', '<head', '</head>', '<body', '</body>'];
    return requiredTags.every(tag => html.includes(tag));
  } catch (err) {
    console.error('HTML validation error:', err);
    return false;
  }
};

export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'Unknown error occurred';
};

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): ((...args: Parameters<F>) => void) => {
  let lastFunc: ReturnType<typeof setTimeout> | null = null;
  let lastRan = 0;

  return (...args: Parameters<F>): void => {
    const now = Date.now();
    if (!lastRan || now - lastRan >= limit) {
      func(...args);
      lastRan = now;
    } else if (!lastFunc) {
      lastFunc = setTimeout(() => {
        func(...args);
        lastFunc = null;
        lastRan = Date.now();
      }, limit - (now - lastRan));
    }
  };
};