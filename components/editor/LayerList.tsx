'use client';

import { Layer } from './types';

interface LayerListProps {
  layers: Layer[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export function LayerList({ layers, selectedId, onSelect, onDelete, onMoveUp, onMoveDown }: LayerListProps) {
  const reversedLayers = [...layers].reverse();

  return (
    <ul className="menu bg-base-100 w-full rounded-box p-2">
      {reversedLayers.map((layer) => (
        <li key={layer.id} className="mb-1">
          <div
            className={`flex justify-between items-center p-2 rounded-lg ${layer.id === selectedId ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
            onClick={() => onSelect(layer.id)}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="opacity-70 font-mono">{layer.type[0].toUpperCase()}</span>
              <span className="truncate max-w-[80px] text-sm font-medium">{layer.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                className={`btn btn-xs btn-square ${layer.id === selectedId ? 'btn-ghost text-primary-content' : 'btn-ghost'}`}
                title="Move Up (Bring Forward)"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp(layer.id);
                }}
              >
                ↑
              </button>
              <button
                className={`btn btn-xs btn-square ${layer.id === selectedId ? 'btn-ghost text-primary-content' : 'btn-ghost'}`}
                title="Move Down (Send Backward)"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown(layer.id);
                }}
              >
                ↓
              </button>
              <button
                className={`btn btn-xs btn-square ${layer.id === selectedId ? 'btn-ghost text-primary-content' : 'btn-ghost text-error'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(layer.id);
                }}
              >
                &times;
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
