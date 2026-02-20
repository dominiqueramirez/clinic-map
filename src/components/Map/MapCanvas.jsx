import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { select } from 'd3-selection';
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';
import { json as d3Json } from 'd3';
import * as topojson from 'topojson-client';
import { useMapProjection } from '../../hooks/useMapProjection';
import { TOPO_URL, VA_COLORS, STATE_FILL } from '../../constants/design';
import ClinicDot from './ClinicDot';
import ClinicLabel from './ClinicLabel';
import MapLegend from './MapLegend';

/**
 * SVG map container with D3 AlbersUSA projection, zoom/pan, and state outlines.
 * Dark navy background, single-color states, red-box labels with leader lines.
 * Exposes getSvgEl() via ref for image export.
 */
const MapCanvas = forwardRef(function MapCanvas({
  clinics,
  labeledNames,
  labelSettings,
  selectedClinic,
  onSelectClinic,
  onOffsetChange,
  onLabelClick,
  overlayImage,
  overlayOpacity,
}, ref) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const { projection, geoPath, dimensions } = useMapProjection(containerRef);
  const [stateFeatures, setStateFeatures] = useState([]);
  const [tooltip, setTooltip] = useState(null);

  // Expose SVG element for image export
  useImperativeHandle(ref, () => ({
    getSvgEl: () => svgRef.current,
  }));

  // Load TopoJSON
  useEffect(() => {
    d3Json(TOPO_URL).then((us) => {
      const features = topojson.feature(us, us.objects.states).features;
      setStateFeatures(features);
    });
  }, []);

  // D3 zoom behavior
  useEffect(() => {
    const svg = select(svgRef.current);
    const g = select(gRef.current);

    const zoomBehavior = d3Zoom()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Double-click to reset zoom
    svg.on('dblclick.zoom', () => {
      svg.transition().duration(500).call(zoomBehavior.transform, zoomIdentity);
    });

    return () => {
      svg.on('.zoom', null);
    };
  }, []);

  // Click background to deselect
  const handleBackgroundClick = useCallback(
    (e) => {
      if (e.target === svgRef.current || e.target.tagName === 'rect') {
        onSelectClinic(null);
      }
    },
    [onSelectClinic]
  );

  const handleTooltipShow = useCallback((clinic, event) => {
    setTooltip({
      clinic,
      x: event.clientX + 12,
      y: event.clientY - 12,
    });
  }, []);

  const handleTooltipHide = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1 h-full overflow-hidden" style={{ background: VA_COLORS.mapbg }}>
      {/* Title banner */}
      <div
        className="absolute top-0 left-0 right-0 z-10 text-center py-4 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(10,36,60,0.95) 60%, transparent 100%)' }}
      >
        <h2
          className="text-white text-3xl font-bold tracking-wide"
          style={{ fontFamily: "'Source Sans 3', 'Myriad Pro', sans-serif" }}
        >
          {clinics.length} VA Clinics Opened
        </h2>
        <p className="text-va-muted text-base -mt-0.5">Since Jan. 20, 2025</p>
      </div>

      <svg
        ref={svgRef}
        width={dimensions.w}
        height={dimensions.h}
        onClick={handleBackgroundClick}
        className="block"
      >
        {/* Dark background rect */}
        <rect width={dimensions.w} height={dimensions.h} fill={VA_COLORS.mapbg} />
        <g ref={gRef}>
          {/* State outlines — filled by region */}
          {stateFeatures.map((feature, i) => (
            <path
              key={i}
              d={geoPath(feature) || ''}
              fill={STATE_FILL}
              stroke="#0a243c"
              strokeWidth={0.8}
            />
          ))}

          {/* Overlay image — above states, below dots/labels/leaders */}
          {overlayImage && (
            <image
              href={overlayImage}
              x={0}
              y={0}
              width={dimensions.w}
              height={dimensions.h}
              preserveAspectRatio="xMidYMid slice"
              opacity={overlayOpacity}
            />
          )}

          {/* Leader lines — rendered behind dots and labels */}
          {clinics.map((clinic) => {
            if (!labeledNames.has(clinic.n)) return null;
            if (clinic.lat == null || clinic.lon == null) return null;
            const pos = projection([clinic.lon, clinic.lat]);
            if (!pos) return null;
            const off = labelSettings.offsets[clinic.n] || { x: 0, y: -30 };
            return (
              <line
                key={`leader-${clinic.n}`}
                x1={pos[0]}
                y1={pos[1]}
                x2={pos[0] + (off.x || 0)}
                y2={pos[1] + (off.y || -30)}
                stroke="#fff"
                strokeWidth={1.2}
              />
            );
          })}

          {/* Clinic dots — always visible */}
          {clinics.map((clinic) => {
            if (clinic.lat == null || clinic.lon == null) return null;
            const pos = projection([clinic.lon, clinic.lat]);
            if (!pos) return null;
            return (
              <ClinicDot
                key={`dot-${clinic.n}`}
                clinic={clinic}
                cx={pos[0]}
                cy={pos[1]}
                isSelected={selectedClinic?.n === clinic.n}
                onSelect={onSelectClinic}
                onTooltipShow={handleTooltipShow}
                onTooltipHide={handleTooltipHide}
              />
            );
          })}

          {/* Clinic labels — only when filter passes */}
          {clinics.map((clinic) => {
            if (!labeledNames.has(clinic.n)) return null;
            if (clinic.lat == null || clinic.lon == null) return null;
            const pos = projection([clinic.lon, clinic.lat]);
            if (!pos) return null;
            return (
              <ClinicLabel
                key={`label-${clinic.n}`}
                clinic={clinic}
                baseX={pos[0]}
                baseY={pos[1]}
                labelSettings={labelSettings}
                isSelected={selectedClinic?.n === clinic.n}
                onOffsetChange={onOffsetChange}
                onClick={onLabelClick}
              />
            );
          })}
        </g>
      </svg>

      {/* Map legend */}
      <MapLegend />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="map-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-semibold">{tooltip.clinic.n}</div>
          <div>
            {tooltip.clinic.c}, {tooltip.clinic.s}
          </div>
          {tooltip.clinic.date && <div>Opened: {tooltip.clinic.date}</div>}
        </div>
      )}
    </div>
  );
});

export default MapCanvas;
