'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCanvas } from './useCanvas';
import { LayerList } from './LayerList';
import { PropertyPanel } from './PropertyPanel';
import { AICopyHelper } from './AICopyHelper';
import { Layer } from './types';
import { updateTemplate } from '@/app/templates/updateActions';
import { createDesignFromTemplate } from '@/app/designs/actions';
import { updateDesign } from '@/app/designs/updateActions';
import { Toast } from '../ui/Toast';
import Konva from 'konva';

// Dynamic import for CanvasStage to avoid SSR issues with Konva
const CanvasStage = dynamic(() => import('./CanvasStage'), { ssr: false });

interface EditorWrapperProps {
  template: {
    id: string;
    name: string;
    channel: string;
    canvas_data: { layers: Layer[] };
  };
  mode?: 'template' | 'design';
}

export default function EditorWrapper({ template, mode = 'template' }: EditorWrapperProps) {
  const { state, actions } = useCanvas(template.canvas_data?.layers || []);
  const stageRef = React.useRef<Konva.Stage | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (mode === 'template') {
        await updateTemplate(template.id, { layers: state.layers });
      } else {
        await updateDesign(template.id, { layers: state.layers });
      }
      setToast({ message: 'Saved successfully!', type: 'success' });
    } catch (e) {
      console.error(e);
      setToast({ message: 'Failed to save', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUseTemplate = async () => {
    await createDesignFromTemplate(template.id);
  };

  const handleAddText = () => {
    const newLayer: Layer = {
      id: crypto.randomUUID(),
      type: 'text',
      name: 'Text Layer',
      x: 100,
      y: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      text: 'Your text here',
      fontSize: 24,
      fill: '#000000',
    };
    actions.addLayer(newLayer);
  };

  const handleAddImage = () => {
    const url = '/next.svg';
    if (url) {
      const newLayer: Layer = {
        id: crypto.randomUUID(),
        type: 'image',
        name: 'Image Layer',
        x: 150,
        y: 150,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        src: url,
        opacity: 1,
      };
      actions.addLayer(newLayer);
    }
  };

  const handleMoveUp = (id: string) => {
    const index = state.layers.findIndex((l) => l.id === id);
    if (index < state.layers.length - 1) {
      actions.reorderLayers(index, index + 1);
    }
  };

  const handleMoveDown = (id: string) => {
    const index = state.layers.findIndex((l) => l.id === id);
    if (index > 0) {
      actions.reorderLayers(index, index - 1);
    }
  };

  const handleExportPNG = () => {
    if (!stageRef.current) return;

    // Deselect anyway to avoid transformer in export
    actions.selectLayer(null);

    // Wait a tick for transformer to disappear
    setTimeout(() => {
      if (!stageRef.current) {
        setToast({ message: 'Something went wrong', type: 'error' });
        return;
      }
      const uri = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = `${template.name || 'design'}.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToast({ message: 'Exported PNG!', type: 'success' });
    }, 100);
  };

  const selectedLayer = state.layers.find((l) => l.id === state.selectedId);

  // Keyboard Nudging
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.selectedId) return;
      // avoid moving when typing in inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const shift = e.shiftKey ? 10 : 1;
      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case 'ArrowLeft':
          dx = -shift;
          break;
        case 'ArrowRight':
          dx = shift;
          break;
        case 'ArrowUp':
          dy = -shift;
          break;
        case 'ArrowDown':
          dy = shift;
          break;
        default:
          return; // exit if not arrow key
      }

      e.preventDefault();
      const layer = state.layers.find((l) => l.id === state.selectedId);
      if (layer) {
        actions.updateLayer(layer.id, { x: layer.x + dx, y: layer.y + dy });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedId, state.layers, actions]);

  return (
    <div className="flex flex-col h-screen">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* Top Bar */}
      <header className="navbar bg-base-100 border-b border-base-200 px-4 shrink-0">
        <div className="flex-1">
          <Link href="/templates" className="btn btn-ghost text-xl">
            &larr;
          </Link>
          <span className="font-bold text-lg ml-2">{template.name}</span>
          <span className="badge ml-4 capitalize">{template.channel}</span>
        </div>
        <div className="flex-none gap-2">
          <button className="btn btn-ghost" onClick={handleAddText}>
            Add Text
          </button>
          <button className="btn btn-ghost" onClick={handleAddImage}>
            Add Image
          </button>
          <button className="btn btn-ghost" onClick={handleExportPNG}>
            Export PNG
          </button>
          {mode === 'template' && (
            <button className="btn btn-secondary btn-sm" onClick={handleUseTemplate}>
              Use Template
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : `Save ${mode === 'template' ? 'Template' : 'Design'}`}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Layers */}
        <aside className="w-64 bg-base-200 border-r border-base-300 p-4 shrink-0 overflow-y-auto">
          <h3 className="font-bold mb-4">Layers</h3>
          <LayerList
            layers={state.layers}
            selectedId={state.selectedId}
            onSelect={actions.selectLayer}
            onDelete={actions.deleteLayer}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
          />
        </aside>

        {/* Center: Canvas */}
        <main className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center p-8">
          <div className="shadow-lg bg-white">
            <CanvasStage
              ref={stageRef}
              layers={state.layers}
              selectedId={state.selectedId}
              onSelect={actions.selectLayer}
              onChange={actions.updateLayer}
            />
          </div>
        </main>

        {/* Right Sidebar: Properties */}
        <aside className="w-80 bg-base-200 border-l border-base-300 p-4 shrink-0 overflow-y-auto">
          <h3 className="font-bold mb-4">Properties</h3>
          <PropertyPanel selectedLayer={selectedLayer} onChange={actions.updateLayer} />
          <div className="divider"></div>
          <AICopyHelper
            disabled={selectedLayer?.type !== 'text'}
            onApply={(text) => {
              if (state.selectedId) {
                actions.updateLayer(state.selectedId, { text });
              }
            }}
          />
        </aside>
      </div>
    </div>
  );
}
