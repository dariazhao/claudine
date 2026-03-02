import { prisma } from "@/lib/db";

export interface AnomalyResult {
  isAnomaly: boolean;
  reason: string | null;
}

/**
 * Welford's online algorithm for running mean + variance.
 * Returns anomaly detection result and updates the user's Baseline record.
 */
export async function checkAndUpdateBaseline(
  userId: string,
  newScore: number
): Promise<AnomalyResult> {
  let baseline = await prisma.baseline.findUnique({ where: { userId } });

  if (!baseline) {
    // Initialize baseline with first data point
    baseline = await prisma.baseline.create({
      data: {
        userId,
        sampleCount: 1,
        mean: newScore,
        stdDev: 0.5,
      },
    });
    return { isAnomaly: false, reason: null };
  }

  const { sampleCount, mean, stdDev } = baseline;

  // Cold start: no flagging until 5+ samples
  const MIN_SAMPLES = 5;
  const isAnomaly =
    sampleCount >= MIN_SAMPLES &&
    Math.abs(newScore - mean) > 2.0 * Math.max(stdDev, 0.1);

  // Welford's update: new_mean = old_mean + (x - old_mean) / n
  const n = sampleCount + 1;
  const delta = newScore - mean;
  const newMean = mean + delta / n;
  const delta2 = newScore - newMean;

  // Welford's M2 update (we store stdDev directly so we approximate)
  // Simplified running std dev: std = sqrt((old_std^2 * (n-1) + delta*delta2) / n)
  const oldVariance = stdDev * stdDev;
  const newVariance = (oldVariance * (n - 1) + delta * delta2) / n;
  const newStdDev = Math.sqrt(Math.max(0, newVariance));

  await prisma.baseline.update({
    where: { userId },
    data: {
      sampleCount: n,
      mean: newMean,
      stdDev: newStdDev || 0.5,
    },
  });

  const reason = isAnomaly
    ? `Score ${newScore.toFixed(2)} is ${Math.abs(newScore - mean).toFixed(2)} points from baseline mean ${mean.toFixed(2)} (±${(2 * Math.max(stdDev, 0.1)).toFixed(2)})`
    : null;

  return { isAnomaly, reason };
}
