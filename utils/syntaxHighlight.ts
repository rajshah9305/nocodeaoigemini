export const syntaxHighlight = (code: string): string => {
  return code
    .replace(/(&lt;!DOCTYPE[^&]*&gt;)/g, '<span class="text-purple-400">$1</span>')
    .replace(/(&lt;\/?[a-z][a-z0-9]*)/gi, '<span class="text-blue-400">$1</span>')
    .replace(/([a-z-]+)=/gi, '<span class="text-yellow-400">$1</span>=')
    .replace(/="([^"]*)"/g, '=<span class="text-green-400">"$1"</span>')
    .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>')
    .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)\b/g, '<span class="text-pink-400">$1</span>')
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-orange-400">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="text-cyan-400">$1</span>');
};

export const escapeHtml = (html: string): string => {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
