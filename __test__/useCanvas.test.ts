import { describe, it, expect } from 'vitest';
import { useCanvas } from '../components/editor/useCanvas';

import { renderHook, act } from '@testing-library/react';
import { Layer } from '../components/editor/types';

describe('useCanvas Hook', () => {
  it('should initialize with empty layers', () => {
    const { result } = renderHook(() => useCanvas());
    expect(result.current.state.layers).toEqual([]);
    expect(result.current.state.selectedId).toBeNull();
  });

  it('should add a layer', () => {
    const { result } = renderHook(() => useCanvas());
    const layer: Layer = {
      id: '1',
      type: 'text',
      name: 'Test',
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };

    act(() => {
      result.current.actions.addLayer(layer);
    });

    expect(result.current.state.layers).toHaveLength(1);
    expect(result.current.state.layers[0]).toEqual(layer);
    expect(result.current.state.selectedId).toBe('1');
  });

  it('should update a layer', () => {
    const layer: Layer = {
      id: '1',
      type: 'text',
      name: 'Test',
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const { result } = renderHook(() => useCanvas([layer]));

    act(() => {
      result.current.actions.updateLayer('1', { x: 100 });
    });

    expect(result.current.state.layers[0].x).toBe(100);
  });

  it('should delete a layer', () => {
    const layer: Layer = {
      id: '1',
      type: 'text',
      name: 'Test',
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const { result } = renderHook(() => useCanvas([layer]));

    act(() => {
      result.current.actions.deleteLayer('1');
    });

    expect(result.current.state.layers).toHaveLength(0);
  });
});
