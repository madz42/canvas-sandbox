'use client';

import { Layer } from './types';

interface PropertyPanelProps {
  selectedLayer: Layer | undefined;
  onChange: (id: string, attrs: Partial<Layer>) => void;
}

export function PropertyPanel({ selectedLayer, onChange }: PropertyPanelProps) {
  if (!selectedLayer) {
    return <div className="text-gray-500 text-sm">Select a layer to edit properties</div>;
  }

  const handleChange = (key: keyof Layer, value: Layer[keyof Layer]) => {
    onChange(selectedLayer.id, { [key]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          value={selectedLayer.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="input input-bordered input-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text">X</span>
          </label>
          <input
            type="number"
            value={Math.round(selectedLayer.x)}
            onChange={(e) => handleChange('x', Number(e.target.value))}
            className="input input-bordered input-sm"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Y</span>
          </label>
          <input
            type="number"
            value={Math.round(selectedLayer.y)}
            onChange={(e) => handleChange('y', Number(e.target.value))}
            className="input input-bordered input-sm"
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Opacity</span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={selectedLayer.opacity ?? 1}
          onChange={(e) => handleChange('opacity', Number(e.target.value))}
          className="range range-xs"
        />
      </div>

      {selectedLayer.type === 'text' && (
        <>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Text Content</span>
            </label>
            <textarea
              value={selectedLayer.text}
              onChange={(e) => handleChange('text', e.target.value)}
              className="textarea textarea-bordered h-24"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Font Size</span>
            </label>
            <input
              type="number"
              value={selectedLayer.fontSize}
              onChange={(e) => handleChange('fontSize', Number(e.target.value))}
              className="input input-bordered input-sm"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Color</span>
            </label>
            <input
              type="color"
              value={(selectedLayer.fill as string) || '#000000'}
              onChange={(e) => handleChange('fill', e.target.value)}
              className="input input-bordered input-sm w-full h-10 p-1"
            />
          </div>
        </>
      )}

      {selectedLayer.type === 'image' && (
        <div className="form-control">
          <label className="label">
            <span className="label-text">Image URL</span>
          </label>
          <input
            type="text"
            value={selectedLayer.src}
            onChange={(e) => handleChange('src', e.target.value)}
            className="input input-bordered input-sm"
          />
        </div>
      )}
    </div>
  );
}
