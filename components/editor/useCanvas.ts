import { useReducer, useCallback } from 'react';
import { CanvasState, CanvasAction, Layer } from './types';

const initialState: CanvasState = {
  layers: [],
  selectedId: null,
};

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'ADD_LAYER':
      return {
        ...state,
        layers: [...state.layers, action.payload],
        selectedId: action.payload.id,
      };
    case 'UPDATE_LAYER':
      return {
        ...state,
        layers: state.layers.map((layer) =>
          layer.id === action.payload.id ? { ...layer, ...action.payload.attrs } : layer,
        ),
      };
    case 'SELECT_LAYER':
      return {
        ...state,
        selectedId: action.payload,
      };
    case 'DELETE_LAYER':
      return {
        ...state,
        layers: state.layers.filter((l) => l.id !== action.payload),
        selectedId: state.selectedId === action.payload ? null : state.selectedId,
      };
    case 'REORDER_LAYERS': {
      const { fromIndex, toIndex } = action.payload;
      const layers = [...state.layers];
      const [removed] = layers.splice(fromIndex, 1);
      layers.splice(toIndex, 0, removed);
      return { ...state, layers };
    }
    default:
      return state;
  }
}

export function useCanvas(initialLayers: Layer[] = []) {
  const [state, dispatch] = useReducer(canvasReducer, {
    ...initialState,
    layers: initialLayers,
  });

  const addLayer = useCallback((layer: Layer) => {
    dispatch({ type: 'ADD_LAYER', payload: layer });
  }, []);

  const updateLayer = useCallback((id: string, attrs: Partial<Layer>) => {
    dispatch({ type: 'UPDATE_LAYER', payload: { id, attrs } });
  }, []);

  const selectLayer = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_LAYER', payload: id });
  }, []);

  const deleteLayer = useCallback((id: string) => {
    dispatch({ type: 'DELETE_LAYER', payload: id });
  }, []);

  const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_LAYERS', payload: { fromIndex, toIndex } });
  }, []);

  return {
    state,
    actions: {
      addLayer,
      updateLayer,
      selectLayer,
      deleteLayer,
      reorderLayers,
    },
  };
}
