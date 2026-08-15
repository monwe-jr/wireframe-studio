export function bandAmplitudes(frequencyData) {
  const n = frequencyData.length;
  if (!n) return { amplitude: 0, low: 0, mid: 0, high: 0 };
  const third = Math.max(1, Math.floor(n / 3));
  let lowSum = 0, lowCount = 0,
    midSum = 0, midCount = 0,
    highSum = 0, highCount = 0,
    total = 0;
  for (let i = 0; i < n; i++) {
    const v = frequencyData[i];
    total += v;
    if (i < third) { lowSum += v; lowCount++; }
    else if (i < third * 2) { midSum += v; midCount++; }
    else { highSum += v; highCount++; }
  }
  return {
    amplitude: total / n / 255,
    low: lowCount ? lowSum / lowCount / 255 : 0,
    mid: midCount ? midSum / midCount / 255 : 0,
    high: highCount ? highSum / highCount / 255 : 0,
  };
}
