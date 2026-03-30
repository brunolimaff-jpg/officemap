export type SpecialistId =
  | 'satya'
  | 'uncle_bob'
  | 'karpathy'
  | 'rogati'
  | 'osmani'
  | 'whittaker'
  | 'dixon'
  | 'dodds'
  | 'rauch'
  | 'rodrigues'
  | 'kozyrkov'
  | 'cagan'
  | 'grove';

export type SpecialistStatus = 'available' | 'thinking' | 'responding';

export interface Specialist {
  id: SpecialistId;
  name: string;
  role: string;
  specialty: string;
  tone: string;
  color: string;
  realPerson: string;
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
  | 'mug'
  | 'glass_wall'
  | 'sign'
  | 'monitor_dual'
  | 'fridge'
  | 'coffee_machine'
  | 'microwave'
  | 'pool_table'
  | 'ac_unit'
  | 'locker'
  | 'tv_screen';

export interface Furniture {
  id: string;
  type: FurnitureType;
  x: number;
  y: number;
  direction?: number;
  color?: string;
  label?: string;
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
