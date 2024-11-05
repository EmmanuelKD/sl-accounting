type ThresholdDetail = {
  remainingIncome: number;
  currentPercent: number;
  numberOfThreshold: number;
  thresholdAmount: number;
};

type TaxCalculationResult = {
  gross: number;
  nassit: number;
  taxableIncome: number;
  thresholdFree: number;
  salariesThresholds: ThresholdDetail[];
  totalTax: number;
};

export function calculateTax(amount: number): TaxCalculationResult {
  const nassitRate = 0.05;
  const taxThresholds = [
    { threshold: 600_000, rate: 0.15 },
    { threshold: 1_000_000, rate: 0.2 },
    { threshold: 1_500_000, rate: 0.25 },
    { threshold: Infinity, rate: 0.3 },
  ];

  const gross = amount;
  const nassit = gross * nassitRate;
  const taxableIncome = gross - nassit;
  let remainingIncome = taxableIncome;

  const salariesThresholds: ThresholdDetail[] = [];
  let totalTax = 0;

  let previousThreshold = 0;

  for (const { threshold, rate } of taxThresholds) {
    if (remainingIncome <= 0) break;

    const thresholdAmount = Math.min(remainingIncome, threshold - previousThreshold);
    const thresholdTax = thresholdAmount * rate;

    salariesThresholds.push({
      remainingIncome,
      currentPercent: rate,
      numberOfThreshold: thresholdAmount,
      thresholdAmount: thresholdTax,
    });

    totalTax += thresholdTax;
    remainingIncome -= thresholdAmount;
    previousThreshold = threshold; // Update for the next bracket
  }

  return {
    gross,
    nassit,
    taxableIncome,
    thresholdFree: taxableIncome <= taxThresholds[0].threshold ? taxableIncome : taxThresholds[0].threshold,
    salariesThresholds,
    totalTax,
  };
}
