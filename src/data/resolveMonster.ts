// Recursive monster resolver for 5etools-style _copy and _mod fields
export function resolveMonster(monster: any, allMonsters: any[], seen: Set<string> = new Set()): any {
  if (!monster || typeof monster !== 'object') return monster;
  if (!monster._copy) return { ...monster };

  // Prevent infinite loops
  const key = `${monster._copy.name}|${monster._copy.source}`;
  if (seen.has(key)) throw new Error('Monster copy loop detected: ' + key);
  seen.add(key);

  // Find the base monster
  const base = allMonsters.find(
    (m: any) => m.name.trim().toLowerCase() === monster._copy.name.trim().toLowerCase() && m.source.trim().toLowerCase() === monster._copy.source.trim().toLowerCase()
  );
  if (!base) throw new Error(`Base monster not found: ${monster._copy.name} (${monster._copy.source})`);

  // Recursively resolve the base
  let resolved = resolveMonster(base, allMonsters, seen);

  // Apply _mod if present
  if (monster._copy._mod || monster._mod) {
    const mods = monster._copy._mod || monster._mod;
    resolved = applyMod(resolved, mods);
  }

  // Merge the rest of the monster fields (monster overrides base)
  const { _copy, _mod, ...rest } = monster;
  return { ...resolved, ...rest };
}

// Simple mod application (only replaceTxt for now)
function applyMod(monster: any, mods: any): any {
  let result = { ...monster };
  if (Array.isArray(mods)) {
    mods.forEach(mod => {
      result = applyMod(result, mod);
    });
    return result;
  }
  if (mods['*'] && mods['*'].mode === 'replaceTxt') {
    const { replace, with: withStr } = mods['*'];
    // Replace all string fields
    for (const key in result) {
      if (typeof result[key] === 'string') {
        result[key] = result[key].replace(new RegExp(replace, 'gi'), withStr);
      }
    }
  }
  // Add more mod types as needed
  return result;
} 