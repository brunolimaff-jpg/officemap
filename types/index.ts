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
  // ─── Mobília existente ──────────────────────────────────────────────────────
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
  // ─── Novos tipos — ref: Habbo Corp escritório ────────────────────────────────
  | 'glass_wall'      // parede de vidro divisória entre zonas
  | 'sign'            // placa/letreiro na recepção
  | 'monitor_dual'    // dual monitor nas workstations
  | 'fridge'          // geladeira na copa
  | 'coffee_machine'  // cafeteira profissional na copa
  | 'microwave'       // micro-ondas na copa
  | 'pool_table'      // mesa de sinuca/ping-pong no lounge
  | 'ac_unit'         // ar-condicionado decorativo
  | 'locker'          // armário de funcionário
  | 'tv_screen';      // tela de TV com gráficos

export interface Furniture {
  id: string;
  type: FurnitureType;
  x: number;
  y: number;
  direction?: number;
  color?: string;
  label?: string; // texto para sign, tv_screen, etc.
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
