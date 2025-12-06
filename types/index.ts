// Core Application Types
export type ViewType = 'landing' | 'workspace';
export type DeviceType = 'mobile' | 'desktop';
export type OrientationType = 'portrait' | 'landscape';
export type TabType = 'preview' | 'code' | 'logs';

// UI Component Types
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'dark'
  | 'success'
  | 'ghost'
  | 'danger'
  | 'icon'
  | 'outline';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

export interface LogEntry {
  type: 'info' | 'success' | 'error';
  text: string;
  timestamp: string;
}

export interface HistoryEntry {
  code: string;
  prompt: string;
  timestamp: number;
}