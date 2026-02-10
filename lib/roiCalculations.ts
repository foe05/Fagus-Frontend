import type {
  ROIInputData,
  ROICalculationResult,
  YearlyProjection,
} from './roiTypes';

// ============================================
// CONSTANTS
// ============================================

const PROJECTION_YEARS = 5;
const DISCOUNT_RATE = 0.08; // 8% annual discount rate for NPV calculation

// ============================================
// TIME SAVINGS CALCULATIONS
// ============================================

/**
 * Calculate annual time savings in hours
 * @param inputData - ROI input data
 * @returns Annual time savings in hours
 */
export function calculateTimeSavings(inputData: ROIInputData): number {
  const {
    manualProcessTimeHours,
    annualFrequency,
    expectedTimeReductionPercentage,
  } = inputData;

  const timeReductionDecimal = expectedTimeReductionPercentage / 100;
  const hoursPerInstance = manualProcessTimeHours * timeReductionDecimal;
  const annualTimeSavingsHours = hoursPerInstance * annualFrequency;

  return annualTimeSavingsHours;
}

/**
 * Calculate annual labor cost savings from time reduction
 * @param inputData - ROI input data
 * @returns Annual labor cost savings
 */
export function calculateLaborCostSavings(inputData: ROIInputData): number {
  const { employeeHourlyRate } = inputData;
  const timeSavingsHours = calculateTimeSavings(inputData);

  return timeSavingsHours * employeeHourlyRate;
}

// ============================================
// ERROR REDUCTION CALCULATIONS
// ============================================

/**
 * Calculate annual error cost savings from error reduction
 * @param inputData - ROI input data
 * @returns Annual error cost savings
 */
export function calculateErrorCostSavings(inputData: ROIInputData): number {
  const {
    errorRatePercentage,
    averageErrorCost,
    annualFrequency,
    expectedErrorReductionPercentage,
  } = inputData;

  const errorRateDecimal = errorRatePercentage / 100;
  const errorReductionDecimal = expectedErrorReductionPercentage / 100;

  const currentAnnualErrors = annualFrequency * errorRateDecimal;
  const errorsSaved = currentAnnualErrors * errorReductionDecimal;
  const annualErrorCostSavings = errorsSaved * averageErrorCost;

  return annualErrorCostSavings;
}

// ============================================
// INVESTMENT CALCULATIONS
// ============================================

/**
 * Calculate total initial investment cost
 * @param inputData - ROI input data
 * @returns Total initial investment
 */
export function calculateTotalInvestment(inputData: ROIInputData): number {
  const { implementationCost, trainingCost } = inputData;
  return implementationCost + trainingCost;
}

/**
 * Calculate total annual savings (labor + error reduction)
 * @param inputData - ROI input data
 * @returns Total annual savings
 */
export function calculateTotalAnnualSavings(inputData: ROIInputData): number {
  const laborSavings = calculateLaborCostSavings(inputData);
  const errorSavings = calculateErrorCostSavings(inputData);

  return laborSavings + errorSavings;
}

// ============================================
// PAYBACK PERIOD CALCULATIONS
// ============================================

/**
 * Calculate payback period in months
 * @param inputData - ROI input data
 * @returns Payback period in months (0 if never breaks even)
 */
export function calculatePaybackPeriod(inputData: ROIInputData): number {
  const totalInvestment = calculateTotalInvestment(inputData);
  const annualSavings = calculateTotalAnnualSavings(inputData);
  const annualMaintenanceCost = inputData.annualMaintenanceCost;

  const netAnnualBenefit = annualSavings - annualMaintenanceCost;

  // If net benefit is negative or zero, never breaks even
  if (netAnnualBenefit <= 0) {
    return 0;
  }

  const yearsToPayback = totalInvestment / netAnnualBenefit;
  const monthsToPayback = yearsToPayback * 12;

  return Math.round(monthsToPayback * 10) / 10; // Round to 1 decimal place
}

// ============================================
// ROI PERCENTAGE CALCULATIONS
// ============================================

/**
 * Calculate ROI percentage over the projection period
 * @param inputData - ROI input data
 * @returns ROI percentage
 */
export function calculateROIPercentage(inputData: ROIInputData): number {
  const totalInvestment = calculateTotalInvestment(inputData);
  const annualSavings = calculateTotalAnnualSavings(inputData);
  const annualMaintenanceCost = inputData.annualMaintenanceCost;

  const totalSavingsOverPeriod = annualSavings * PROJECTION_YEARS;
  const totalMaintenanceOverPeriod = annualMaintenanceCost * PROJECTION_YEARS;
  const netBenefit = totalSavingsOverPeriod - totalMaintenanceOverPeriod;

  const totalNetGain = netBenefit - totalInvestment;

  if (totalInvestment === 0) {
    return 0;
  }

  const roiPercentage = (totalNetGain / totalInvestment) * 100;

  return Math.round(roiPercentage * 10) / 10; // Round to 1 decimal place
}

// ============================================
// NET PRESENT VALUE CALCULATIONS
// ============================================

/**
 * Calculate Net Present Value (NPV) using discounted cash flow
 * @param inputData - ROI input data
 * @returns Net Present Value
 */
export function calculateNPV(inputData: ROIInputData): number {
  const totalInvestment = calculateTotalInvestment(inputData);
  const annualSavings = calculateTotalAnnualSavings(inputData);
  const annualMaintenanceCost = inputData.annualMaintenanceCost;

  let npv = -totalInvestment; // Initial investment is negative

  // Calculate discounted cash flows for each year
  for (let year = 1; year <= PROJECTION_YEARS; year++) {
    const netAnnualBenefit = annualSavings - annualMaintenanceCost;
    const discountedBenefit = netAnnualBenefit / Math.pow(1 + DISCOUNT_RATE, year);
    npv += discountedBenefit;
  }

  return Math.round(npv * 100) / 100; // Round to 2 decimal places
}

// ============================================
// YEARLY PROJECTIONS
// ============================================

/**
 * Generate year-by-year projections for the analysis period
 * @param inputData - ROI input data
 * @returns Array of yearly projections
 */
export function generateYearlyProjections(inputData: ROIInputData): YearlyProjection[] {
  const totalInvestment = calculateTotalInvestment(inputData);
  const annualSavings = calculateTotalAnnualSavings(inputData);
  const annualMaintenanceCost = inputData.annualMaintenanceCost;

  const projections: YearlyProjection[] = [];
  let cumulativeBenefit = -totalInvestment; // Start with negative investment

  for (let year = 1; year <= PROJECTION_YEARS; year++) {
    const yearCosts = annualMaintenanceCost;
    const yearSavings = annualSavings;
    const netBenefit = yearSavings - yearCosts;

    cumulativeBenefit += netBenefit;

    const cumulativeROI = totalInvestment === 0
      ? 0
      : (cumulativeBenefit / totalInvestment) * 100;

    projections.push({
      year,
      costs: yearCosts,
      savings: yearSavings,
      cumulativeBenefit: Math.round(cumulativeBenefit * 100) / 100,
      cumulativeROI: Math.round(cumulativeROI * 10) / 10,
    });
  }

  return projections;
}

// ============================================
// MAIN CALCULATION FUNCTION
// ============================================

/**
 * Calculate complete ROI analysis from input data
 * @param inputData - ROI input data
 * @returns Complete ROI calculation results
 */
export function calculateROI(inputData: ROIInputData): ROICalculationResult {
  const annualTimeSavingsHours = calculateTimeSavings(inputData);
  const annualLaborCostSavings = calculateLaborCostSavings(inputData);
  const annualErrorCostSavings = calculateErrorCostSavings(inputData);
  const totalAnnualSavings = calculateTotalAnnualSavings(inputData);

  const totalInvestment = calculateTotalInvestment(inputData);
  const paybackPeriodMonths = calculatePaybackPeriod(inputData);
  const roiPercentage = calculateROIPercentage(inputData);
  const netPresentValue = calculateNPV(inputData);
  const yearlyProjections = generateYearlyProjections(inputData);

  // Calculate 5-year totals
  const totalFiveYearSavings = totalAnnualSavings * PROJECTION_YEARS;
  const totalMaintenanceCosts = inputData.annualMaintenanceCost * PROJECTION_YEARS;
  const totalFiveYearBenefit = totalFiveYearSavings - totalMaintenanceCosts - totalInvestment;

  // Break-even month is when cumulative benefit becomes positive
  let breakEvenMonth = 0;
  if (paybackPeriodMonths > 0 && paybackPeriodMonths <= PROJECTION_YEARS * 12) {
    breakEvenMonth = Math.ceil(paybackPeriodMonths);
  }

  return {
    // Summary metrics
    roiPercentage,
    netPresentValue,
    paybackPeriodMonths,
    breakEvenMonth,

    // Annual projections
    annualTimeSavingsHours: Math.round(annualTimeSavingsHours * 10) / 10,
    annualLaborCostSavings: Math.round(annualLaborCostSavings * 100) / 100,
    annualErrorCostSavings: Math.round(annualErrorCostSavings * 100) / 100,
    totalAnnualSavings: Math.round(totalAnnualSavings * 100) / 100,

    // Lifecycle analysis
    totalInvestment: Math.round(totalInvestment * 100) / 100,
    totalFiveYearSavings: Math.round(totalFiveYearSavings * 100) / 100,
    totalFiveYearBenefit: Math.round(totalFiveYearBenefit * 100) / 100,

    // Year-by-year breakdown
    yearlyProjections,
  };
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate input data for ROI calculation
 * @param inputData - ROI input data to validate
 * @returns True if valid, false otherwise
 */
export function validateROIInput(inputData: Partial<ROIInputData>): boolean {
  if (!inputData) return false;

  // Check required numeric fields are present and positive
  const requiredPositiveFields: (keyof ROIInputData)[] = [
    'manualProcessTimeHours',
    'employeeHourlyRate',
    'annualFrequency',
    'implementationCost',
  ];

  for (const field of requiredPositiveFields) {
    const value = inputData[field];
    if (typeof value !== 'number' || value <= 0) {
      return false;
    }
  }

  // Check percentage fields are in valid range (0-100)
  const percentageFields: (keyof ROIInputData)[] = [
    'errorRatePercentage',
    'expectedTimeReductionPercentage',
    'expectedErrorReductionPercentage',
  ];

  for (const field of percentageFields) {
    const value = inputData[field];
    if (typeof value !== 'number' || value < 0 || value > 100) {
      return false;
    }
  }

  // Check non-negative fields
  const nonNegativeFields: (keyof ROIInputData)[] = [
    'averageErrorCost',
    'annualMaintenanceCost',
    'trainingCost',
  ];

  for (const field of nonNegativeFields) {
    const value = inputData[field];
    if (typeof value !== 'number' || value < 0) {
      return false;
    }
  }

  return true;
}

/**
 * Format currency value for display
 * @param value - Numeric value
 * @param currency - Currency code (default: EUR)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage value for display
 * @param value - Numeric percentage value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format time period in months to human-readable string
 * @param months - Number of months
 * @returns Formatted time string
 */
export function formatPaybackPeriod(months: number): string {
  if (months === 0) {
    return 'Nicht erreichbar';
  }

  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);

  if (years === 0) {
    return `${remainingMonths} ${remainingMonths === 1 ? 'Monat' : 'Monate'}`;
  }

  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'Jahr' : 'Jahre'}`;
  }

  return `${years} ${years === 1 ? 'Jahr' : 'Jahre'} und ${remainingMonths} ${remainingMonths === 1 ? 'Monat' : 'Monate'}`;
}
