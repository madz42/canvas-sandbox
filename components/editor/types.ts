export interface Layer {
  id: string;
  type: 'text' | 'image';
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  // Text specific
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  align?: string;
  // Image specific
  src?: string;
  opacity?: number;
}

export interface CanvasState {
  layers: Layer[];
  selectedId: string | null;
}

export type CanvasAction =
  | { type: 'ADD_LAYER'; payload: Layer }
  | { type: 'UPDATE_LAYER'; payload: { id: string; attrs: Partial<Layer> } }
  | { type: 'SELECT_LAYER'; payload: string | null }
  | { type: 'DELETE_LAYER'; payload: string }
  | { type: 'REORDER_LAYERS'; payload: { fromIndex: number; toIndex: number } };
