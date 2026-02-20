import React, { useCallback } from 'react';

/**
 * A single red circle marker for a clinic on the map.
 */
export default function ClinicDot({
  clinic,
  cx,
  cy,
  isSelected,
  onSelect,
  onTooltipShow,
  onTooltipHide,
}) {
  const radius = isSelected ? 8 : 5.5;

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      onSelect(clinic);
    },
    [clinic, onSelect]
  );

  const handleMouseEnter = useCallback(
    (e) => onTooltipShow(clinic, e.nativeEvent),
    [clinic, onTooltipShow]
  );

  const handleMouseMove = useCallback(
    (e) => onTooltipShow(clinic, e.nativeEvent),
    [clinic, onTooltipShow]
  );

  return (
    <circle
      cx={cx}
      cy={cy}
      r={radius}
      fill="#bf1e2e"
      stroke="#fff"
      strokeWidth={1.5}
      style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={onTooltipHide}
    />
  );
}
