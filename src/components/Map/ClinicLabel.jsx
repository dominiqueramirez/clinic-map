import React, { useRef, useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { select } from 'd3-selection';
import { drag as d3Drag } from 'd3-drag';
import { FONT_STACK, LABEL_RED } from '../../constants/design';

const PAD_X = 7;
const PAD_Y = 4;

/**
 * Draggable red-box label for a clinic on the map.
 * Renders as a <g> with a red <rect> background and white uppercase <text>.
 * Supports multi-line via <tspan> (split on \n).
 * Single-click (no drag) opens the edit panel.
 */
export default function ClinicLabel({
  clinic,
  baseX,
  baseY,
  labelSettings,
  isSelected,
  onOffsetChange,
  onClick,
}) {
  const groupRef = useRef(null);
  const textRef = useRef(null);
  const didDragRef = useRef(false);
  const [box, setBox] = useState(null);

  const offset = labelSettings.offsets[clinic.n] || { x: 0, y: -30 };
  const displayName = labelSettings.displayNames[clinic.n] || clinic.n;
  const fontSize = offset.fs != null ? offset.fs : labelSettings.globalFontSize;

  const lines = displayName.split('\n');
  const lineHeight = fontSize * 1.25;

  // Vertically center the multi-line block
  const totalHeight = lines.length * lineHeight;
  const startDy = -(totalHeight / 2) + lineHeight * 0.8;

  // Measure text bbox for the background rect
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    try {
      const b = el.getBBox();
      if (b.width > 0) setBox(b);
    } catch {
      /* not yet in DOM */
    }
  }, [displayName, fontSize, lines.length]);

  // D3 drag on the group
  useEffect(() => {
    const el = select(groupRef.current);
    let cur = { x: offset.x, y: offset.y };

    const dragBehavior = d3Drag()
      .on('start', () => {
        didDragRef.current = false;
        cur = { x: offset.x, y: offset.y };
      })
      .on('drag', (event) => {
        didDragRef.current = true;
        cur.x += event.dx;
        cur.y += event.dy;
        el.attr('transform', `translate(${baseX + cur.x}, ${baseY + cur.y})`);
      })
      .on('end', () => {
        if (didDragRef.current) {
          onOffsetChange(clinic.n, { x: cur.x, y: cur.y });
        }
      });

    el.call(dragBehavior);
    return () => el.on('.drag', null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseX, baseY, clinic.n]);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (!didDragRef.current) onClick(clinic);
    },
    [clinic, onClick]
  );

  return (
    <g
      ref={groupRef}
      transform={`translate(${baseX + offset.x}, ${baseY + offset.y})`}
      style={{ cursor: 'grab', userSelect: 'none' }}
      onClick={handleClick}
    >
      {/* Red background box */}
      {box && (
        <rect
          x={box.x - PAD_X}
          y={box.y - PAD_Y}
          width={box.width + PAD_X * 2}
          height={box.height + PAD_Y * 2}
          fill={isSelected ? '#f5c400' : LABEL_RED}
        />
      )}
      {/* White uppercase text */}
      <text
        ref={textRef}
        textAnchor="middle"
        fontSize={fontSize}
        fontFamily={FONT_STACK}
        fontWeight={700}
        fill="#fff"
        letterSpacing={0.5}
      >
        {lines.map((line, i) => (
          <tspan key={i} x={0} dy={i === 0 ? startDy : lineHeight}>
            {line.toUpperCase()}
          </tspan>
        ))}
      </text>
    </g>
  );
}
