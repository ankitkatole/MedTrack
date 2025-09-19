// src/utils/analytics.js
export function monthKey(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); // e.g., "Sep 2025" [web:307]
}

export function aggregateMonthly(items, dateField, medicinesFieldGetter) {
  const map = new Map();
  for (const it of items) {
    const key = monthKey(it[dateField] || it.createdAt);
    const meds = medicinesFieldGetter ? medicinesFieldGetter(it) : 0;
    if (!map.has(key)) map.set(key, { month: key, prescriptions: 0, medicines: 0 });
    const row = map.get(key);
    row.prescriptions += 1;
    row.medicines += meds;
  }
  // Sort by actual chronological value
  return Array.from(map.values()).sort((a, b) => new Date(a.month) - new Date(b.month)); // [web:311]
}

export function countTop(items, keyGetter, topN = 5) {
  const map = new Map();
  for (const it of items) {
    const key = keyGetter(it);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([k, v]) => ({ key: k, count: v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}
