export function getVisibleProgressPercent(done, total) {
  if (total <= 0 || done <= 0) {
    return 0;
  }

  if (done >= total) {
    return 100;
  }

  return Math.min(99, Math.max(1, Math.round((done / total) * 100)));
}
