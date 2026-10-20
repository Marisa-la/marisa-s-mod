import { composeModData, optionsFromSettings, CONTENT_FILES } from './marisaProfile.js';
import { clone, object, problem } from './dataUtils.js';

export const isMarisaProfile = (doc, id) => id === 'marisa' && object(doc)
  && doc.profile === 1 && doc.kind === 'marisa' && object(doc.tables)
  && Object.keys(doc.tables).every(k => CONTENT_FILES.includes(k) && object(doc.tables[k]));

function merge(a, b) {
  if (!object(a) || !object(b)) return clone(b);
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = merge(a[k], v);
  return out;
}

// Apply only the profile's changes, retaining records written by earlier plugins.
function delta(current, base, selected) {
  if (JSON.stringify(base) === JSON.stringify(selected)) return current;
  if (!object(base) || !object(selected)) return clone(selected);
  const out = { ...current };
  for (const k of new Set([...Object.keys(base), ...Object.keys(selected)])) {
    if (!Object.hasOwn(selected, k)) delete out[k];
    else out[k] = delta(current?.[k], base[k], selected[k]);
  }
  return out;
}

export function applyMarisaProfile(current, base, doc, { pluginId, settings, permissions }) {
  if (!isMarisaProfile(doc, pluginId)) return { data: current, problems: [problem('PLUGIN_CONTENT_FORMAT', 'profile', 'invalid Marisa profile')] };
  if (!['data.add', 'data.patch'].every(p => permissions.includes(p))) return { data: current, problems: [problem('PLUGIN_CONTENT_PERMISSION', 'profile', 'profile requires data.add and data.patch')] };
  const extended = merge(base, doc.tables);
  const selected = composeModData(base, extended, optionsFromSettings(settings));
  return { data: delta(current, base, selected), problems: [] };
}
