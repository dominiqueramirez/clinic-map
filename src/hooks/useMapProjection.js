import { useState, useEffect, useCallback } from 'react';
import { geoAlbersUsa, geoPath as d3GeoPath } from 'd3-geo';

/**
 * Hook that manages a D3 AlbersUSA projection sized to a container.
 * Recalculates on window resize via ResizeObserver.
 *
 * @param {React.RefObject} containerRef - ref to the SVG container element
 * @returns {{ projection: Function|null, geoPath: Function|null, dimensions: {w,h} }}
 */
export function useMapProjection(containerRef) {
  const [dimensions, setDimensions] = useState({ w: 960, h: 600 });

  // Watch container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ w: width, h: height });
        }
      }
    });
    observer.observe(el);

    // Initial size
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setDimensions({ w: rect.width, h: rect.height });
    }

    return () => observer.disconnect();
  }, [containerRef]);

  const buildProjection = useCallback(() => {
    const { w, h } = dimensions;
    return geoAlbersUsa()
      .scale(w * 1.2)
      .translate([w / 2, h / 2]);
  }, [dimensions]);

  const projection = buildProjection();
  const geoPath = d3GeoPath().projection(projection);

  return { projection, geoPath, dimensions };
}
