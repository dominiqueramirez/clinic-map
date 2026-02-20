/**
 * Parse a CSV string into an array of clinic objects.
 * Expected columns: Clinic Name, City, State, Opening Date
 * Opening Date is optional.
 */
export function parseCsv(csvString) {
  const lines = csvString.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const nameIdx = headers.findIndex((h) => h.includes('clinic') || h.includes('name'));
  const cityIdx = headers.findIndex((h) => h.includes('city'));
  const stateIdx = headers.findIndex((h) => h.includes('state'));
  const dateIdx = headers.findIndex((h) => h.includes('date'));
  const latIdx = headers.findIndex((h) => h === 'lat' || h === 'latitude');
  const lonIdx = headers.findIndex((h) => h === 'lon' || h === 'longitude' || h === 'lng');

  if (nameIdx === -1) {
    console.warn('CSV missing "Clinic Name" column');
    return [];
  }

  return lines.slice(1).map((line) => {
    // Handle quoted fields
    const cols = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        cols.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    cols.push(current.trim());

    const obj = {
      n: cols[nameIdx] || '',
      c: cityIdx >= 0 ? cols[cityIdx] || '' : '',
      s: stateIdx >= 0 ? cols[stateIdx] || '' : '',
      date: dateIdx >= 0 ? cols[dateIdx] || '' : '',
    };

    if (latIdx >= 0 && lonIdx >= 0) {
      const lat = parseFloat(cols[latIdx]);
      const lon = parseFloat(cols[lonIdx]);
      if (!isNaN(lat) && !isNaN(lon)) {
        obj.lat = lat;
        obj.lon = lon;
      }
    }

    return obj;
  }).filter((c) => c.n);
}
