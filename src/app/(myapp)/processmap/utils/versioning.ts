// module scope
export type ProcessLike = {
  processKey?: string | null;
  version?: string | null;
  releaseId?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
};

function extractNumber(str: string | null): number {
  if (!str) return NaN;
  const m = String(str).match(/\d+/);
  return m ? parseInt(m[0], 10) : NaN;
}

function extractMaxNumber(str: string | null): number {
  if (!str) return NaN;
  const m = String(str).match(/\d+/g);
  if (!m || !m.length) return NaN;
  const max = Math.max(...m.map((n) => parseInt(n, 10)));
  return Number.isNaN(max) ? NaN : max;
}

function getTime(p: ProcessLike): number {
  const t = p.updatedAt || p.createdAt || '';
  const parsed = t ? Date.parse(t) : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
}

type VersionRank = { tier: number; num: number; time: number };

function versionRank(p: ProcessLike): VersionRank {
  // 1) Prefer explicit numeric `version`
  const vNum = extractNumber(p.version ?? null);
  if (!Number.isNaN(vNum)) {
    return { tier: 3, num: vNum, time: getTime(p) };
  }

  // 2) Next, the version segment in `releaseId` (key:version:uuid)
  const rel = p.releaseId ?? '';
  if (rel) {
    const parts = rel.split(':');
    if (parts.length >= 2) {
      const segNum = extractNumber(parts[1]);
      if (!Number.isNaN(segNum)) {
        return { tier: 2, num: segNum, time: getTime(p) };
      }
    }
    // 3) Fallback: any max number found in `releaseId`
    const relMax = extractMaxNumber(rel);
    if (!Number.isNaN(relMax)) {
      return { tier: 1, num: relMax, time: getTime(p) };
    }
  }

  // 4) Final fallback: use time only
  return { tier: 0, num: 0, time: getTime(p) };
}

function rankGt(a: VersionRank, b: VersionRank): boolean {
  if (a.tier !== b.tier) return a.tier > b.tier;
  if (a.num !== b.num) return a.num > b.num;
  return a.time > b.time;
}

export function keepLatestByKey<T extends ProcessLike>(processes: T[]): T[] {
  const latestByKey = new Map<string, T>();

  for (const p of processes) {
    const key = (p.processKey ?? '').trim();
    if (!key) {
      continue;
    }

    const prev = latestByKey.get(key);
    const currRank = versionRank(p);

    if (!prev) {
      latestByKey.set(key, p);
      continue;
    }

    const prevRank = versionRank(prev);
    if (rankGt(currRank, prevRank)) {
      latestByKey.set(key, p);
    }
  }

  return Array.from(latestByKey.values());
}