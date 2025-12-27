
export interface BridgeStatus {
  lastMessageSent?: string;
  status: 'idle' | 'testing' | 'success' | 'error';
}

// Fixed: Added missing FileStructure interface used in constants.tsx
export interface FileStructure {
  path: string;
  language: string;
  description: string;
  content: string;
}
