'use client';

import React, { useRef, useEffect } from 'react';
import { Stage, Layer as KonvaLayer, Text, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { Layer } from './types';
import Konva from 'konva';

// Image Component

interface URLImageProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<Layer>) => void;
}

const URLImage = ({ layer, isSelected, onSelect, onChange }: URLImageProps) => {
  const [img] = useImage(layer.src || '');
  const shapeRef = useRef<Konva.Image | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);

  useEffect(() => {
    if (!isSelected) return;
    if (!trRef.current || !shapeRef.current) return;
    trRef.current.nodes([shapeRef.current]);
    const layer = trRef.current.getLayer();
    if (layer) layer.batchDraw();
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        image={img}
        ref={shapeRef}
        {...layer}
        onClick={onSelect}
        onTap={onSelect}
        draggable
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: scaleX,
            scaleY: scaleY,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

// Text Component

interface TextLayerProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<Layer>) => void;
}

const TextLayer = ({ layer, isSelected, onSelect, onChange }: TextLayerProps) => {
  const shapeRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer | null>(null);

  useEffect(() => {
    if (!isSelected) return;
    if (!trRef.current || !shapeRef.current) return;
    trRef.current.nodes([shapeRef.current]);
    const layer = trRef.current.getLayer();
    if (layer) layer.batchDraw();
  }, [isSelected]);

  return (
    <>
      <Text
        ref={shapeRef}
        {...layer}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: scaleX,
            scaleY: scaleY,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

interface CanvasStageProps {
  layers: Layer[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (id: string, newAttrs: Partial<Layer>) => void;
}

const CanvasStage = React.forwardRef<Konva.Stage, CanvasStageProps>(
  ({ layers, selectedId, onSelect, onChange }, ref) => {
    const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        onSelect(null);
      }
    };

    return (
      <Stage
        width={600}
        height={600}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        style={{ background: 'white' }}
        ref={ref}
      >
        <KonvaLayer>
          {layers.map((layer) => {
            if (layer.type === 'image') {
              return (
                <URLImage
                  key={layer.id}
                  layer={layer}
                  isSelected={layer.id === selectedId}
                  onSelect={() => onSelect(layer.id)}
                  onChange={(newAttrs: Partial<Layer>) => onChange(layer.id, newAttrs)}
                />
              );
            } else {
              return (
                <TextLayer
                  key={layer.id}
                  layer={layer}
                  isSelected={layer.id === selectedId}
                  onSelect={() => onSelect(layer.id)}
                  onChange={(newAttrs: Partial<Layer>) => onChange(layer.id, newAttrs)}
                />
              );
            }
          })}
        </KonvaLayer>
      </Stage>
    );
  },
);

CanvasStage.displayName = 'CanvasStage';

export default CanvasStage;
