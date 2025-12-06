const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";
const API_TIMEOUT_MS = 30000; // 30 seconds timeout

interface GeminiServiceOptions {
  apiKey: string;
  onLog?: (type: 'info' | 'success' | 'error', message: string) => void;
  timeout?: number;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
    code?: number;
  };
}

export class GeminiServiceError extends Error {
  constructor(message: string, public code?: number, public details?: any) {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

export const generateAppCode = async (
  prompt: string,
  currentCode: string | null,
  apiKey: string,
  onLog: (type: 'info' | 'success' | 'error', message: string) => void
): Promise<string> => {
  if (!apiKey) {
    throw new GeminiServiceError("API configuration missing. Please add your key in settings.", 400);
  }

  if (!prompt || prompt.trim().length === 0) {
    throw new GeminiServiceError("Prompt cannot be empty.", 400);
  }

  const isRefinement = !!currentCode;

  // Validate API key format
  if (!apiKey.startsWith('AIzaSy') && !apiKey.startsWith('ya29.')) {
    throw new GeminiServiceError("Invalid API key format. Please check your configuration.", 401);
  }

  const systemPrompt = `
    You are Forge.AI, an elite frontend engineer.

    ${isRefinement ? `
    TASK: MODIFY the existing HTML application based on the user's request.
    CONSTRAINTS:
    1.  User Request: "${prompt}"
    2.  EXISTING CODE context is provided below.
    3.  RETURN THE FULLY ASSEMBLED, SINGLE HTML FILE. Do not return diffs.
    4.  Maintain existing features unless asked to remove them.
    ` : `
    TASK: Build a SINGLE-FILE, SELF-CONTAINED HTML application based on: "${prompt}"
    `}

    STRICT OUTPUT RULES:
    1. Output ONLY valid HTML code.
    2. DO NOT include markdown fences (like \`\`\`html).
    3. DO NOT include explanatory text before or after the code.
    4. MUST include <script src="https://cdn.tailwindcss.com"></script> in <head>.
    5. MUST include <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"> in <head>.
    6. Design Philosophy: Modern, Clean, Mobile-First, Interactive.
    7. All JavaScript MUST be contained within <script> tags.
    8. All CSS MUST be contained within <style> tags.
    9. Use standard HTML5 semantic elements.
    10. If the user asks for complex functionality (e.g. 3D), use a CDN link for Three.js.
    11. ${isRefinement ? "CRITICAL: Keep existing functionality working. Only apply requested changes." : "CRITICAL: The app must be fully functional immediately."}

    ${isRefinement ? `\n--- EXISTING CODE ---\n${currentCode}` : ''}
  `;

  try {
    onLog('info', 'Connecting to Gemini neural network...');

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          topP: 0.95,
          topK: 40
        }
      }),
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errorMessage = errData.error?.message || `API Error: ${response.status} ${response.statusText}`;
      throw new GeminiServiceError(errorMessage, response.status, errData);
    }

    const data: GeminiResponse = await response.json();
    let generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new GeminiServiceError("Neural Engine returned empty response.", 500);
    }

    // Aggressive cleanup of markdown fences if the model disobeys
    generatedText = generatedText
      .replace(/^```html/i, '')
      .replace(/^```/, '')
      .replace(/```$/, '')
      .trim();

    // Basic HTML validation
    if (!generatedText.includes('<html') || !generatedText.includes('</html>')) {
      throw new GeminiServiceError("Generated content is not valid HTML.", 500);
    }

    onLog('success', 'Code generation completed successfully.');
    return generatedText;

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new GeminiServiceError(`Request timed out after ${API_TIMEOUT_MS/1000} seconds.`, 408);
      }
      if (error instanceof GeminiServiceError) {
        throw error;
      }
      throw new GeminiServiceError(`Neural network error: ${error.message}`, 500, error);
    }
    throw new GeminiServiceError('Unknown error occurred during code generation.', 500);
  }
};