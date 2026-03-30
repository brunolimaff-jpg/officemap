export type SpecialistId = 'carlos' | 'sophia' | 'andre' | 'diego' | 'raquel' | 'marcos' | 'helena' | 'victor';

export type SpecialistStatus = 'available' | 'thinking' | 'responding';

export interface Specialist {
  id: SpecialistId;
  name: string;
  role: string;
  specialty: string;
  tone: string;
  color: string;
}

export interface Furniture {
  id: string;
  type: 'desk' | 'chair' | 'plant' | 'shelf' | 'monitor' | 'laptop' | 'coffee' | 'water_cooler' | 'whiteboard' | 'sofa' | 'table' | 'server_rack' | 'filing_cabinet' | 'divider' | 'rug' | 'bookshelf';
  x: number;
  y: number;
  direction?: number;
  color?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  specialistId?: SpecialistId; // For group chats to identify who is speaking
}

export interface ConvocationState {
  isOpen: boolean;
  selectedIds: SpecialistId[];
  isGroup: boolean;
}

export interface StreamStatus {
  status: 'idle' | 'loading' | 'streaming' | 'error' | 'success';
  error?: string;
}
