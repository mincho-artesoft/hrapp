/** ISO timestamps double as optimistic revisions. Consecutive writes in the
 * same millisecond must not leave a stale revision looking current. */
export function nextRevisionTimestamp(previous: unknown, now = Date.now()): string {
  const prior = typeof previous === 'string' ? Date.parse(previous) : NaN;
  return new Date(Number.isFinite(prior) ? Math.max(now, prior + 1) : now).toISOString();
}
