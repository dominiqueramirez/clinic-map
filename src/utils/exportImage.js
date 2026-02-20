/**
 * Export an SVG element as a high-resolution PNG.
 *
 * @param {SVGSVGElement} svgEl  — the <svg> DOM element to export
 * @param {object} opts
 * @param {number}  opts.scale     — resolution multiplier (default 3 = ~300 DPI)
 * @param {string}  opts.filename  — download filename
 * @param {string}  opts.bgColor   — background fill (defaults to map bg)
 */
export function exportMapAsPng(svgEl, opts = {}) {
  const { scale = 3, filename = 'va-clinics-map.png', bgColor = '#0d2b45' } = opts;

  return new Promise((resolve, reject) => {
    if (!svgEl) return reject(new Error('No SVG element provided'));

    // Clone the SVG so we can modify it without affecting the live DOM
    const clone = svgEl.cloneNode(true);
    const w = svgEl.getAttribute('width') || svgEl.viewBox?.baseVal?.width || 960;
    const h = svgEl.getAttribute('height') || svgEl.viewBox?.baseVal?.height || 600;

    // Ensure clone has explicit dimensions and xmlns
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', w);
    clone.setAttribute('height', h);

    // Inline Google Fonts so they render in the exported image
    const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap');
    `;
    clone.insertBefore(styleEl, clone.firstChild);

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext('2d');

      // Fill background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, w, h);

      URL.revokeObjectURL(url);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Canvas toBlob failed'));
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          a.click();
          URL.revokeObjectURL(a.href);
          resolve();
        },
        'image/png',
        1.0
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}
