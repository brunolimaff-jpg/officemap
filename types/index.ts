export type SpecialistId = 'carlos' | 'sophia' | 'andre' | 'diego' | 'raquel' | 'marcos' | 'helena' | 'victor';

export type SpecialistStatus = 'available' | 'thinking' | 'responding';

export type RoomId = 'director' | 'meeting' | 'strategy' | 'data' | 'product' | 'engineering';

export interface TilePos {
  col: number;
  row: number;
}

export interface Specialist {
  id: SpecialistId;
  name: string;
  role: string;
  specialty: string;
  tone: string;
  color: string;
  homeRoomId: RoomId;
  col: number;   // position in home room
  row: number;
  meetingCol: number;  // position in meeting room
  meetingRow: number;
}

export type FurnitureType =
  | 'desk' | 'chair' | 'plant' | 'shelf' | 'monitor' | 'laptop'
  | 'coffee' | 'water_cooler' | 'whiteboard' | 'sofa' | 'table'
  | 'server_rack' | 'filing_cabinet' | 'bookshelf' | 'trophy' | 'rug';

export interface RoomFurniture {
  id: string;
  type: FurnitureType;
  col: number;
  row: number;
  color?: string;
}

export interface RoomConfig {
  id: RoomId;
  name: string;
  cols: number;
  rows: number;
  floorColors: [string, string];
  wallColor: string;   // back wall (row=0)
  wallColor2: string;  // left wall (col=0)
  furniture: RoomFurniture[];
  brunoCol?: number;
  brunoRow?: number;
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
