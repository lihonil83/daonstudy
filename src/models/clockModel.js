export function getClockHandAngles(hour, minute) {
  const totalMinutesInCycle = 12 * 60;
  const rawTotalMinutes = hour * 60 + minute;
  const normalizedTotalMinutes =
    ((rawTotalMinutes % totalMinutesInCycle) + totalMinutesInCycle) % totalMinutesInCycle;
  const normalizedHour = Math.floor(normalizedTotalMinutes / 60);
  const normalizedMinute = normalizedTotalMinutes % 60;

  return {
    hourAngle: normalizedHour * 30 + normalizedMinute * 0.5,
    minuteAngle: normalizedMinute * 6,
  };
}
