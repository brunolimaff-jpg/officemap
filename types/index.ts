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

export type FurnitureType =
  | 'desk'
  | 'chair'
  | 'plant'
  | 'shelf'
  | 'monitor'
  | 'laptop'
  | 'coffee'
  | 'water_cooler'
  | 'whiteboard'
  | 'sofa'
  | 'table'
  | 'server_rack'
  | 'filing_cabinet'
  | 'divider'
  | 'rug'
  | 'lamp'
  | 'bookshelf'
  | 'trash'
  | 'computer'
  | 'couch'
  | 'coffee_table'
  | 'cabinet'
  | 'mug';

export interface Furniture {
  id: string;
  type: FurnitureType;
  x: number;
  y: number;
  direction?: number;
  color?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  specialistId?: SpecialistId;
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
