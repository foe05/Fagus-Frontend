// ============================================
// ROI CALCULATOR TYPES
// ============================================

// ============================================
// OPERATION TYPES
// ============================================
export type OperationType =
  | 'forest_inventory'
  | 'harvest_planning'
  | 'timber_logistics'
  | 'certification_management'
  | 'quality_control'
  | 'general';

export interface OperationTypeOption {
  value: OperationType;
  label: string;
  description: string;
}

// ============================================
// INPUT DATA TYPES
// ============================================
export interface ROIInputData {
  // Operation details
  operationType: OperationType;
  operationName?: string;

  // Current process metrics
  manualProcessTimeHours: number;
  employeeHourlyRate: number;
  annualFrequency: number;

  // Error and quality metrics
  errorRatePercentage: number;
  averageErrorCost: number;

  // Digital transformation costs
  implementationCost: number;
  annualMaintenanceCost: number;
  trainingCost: number;

  // Expected improvements
  expectedTimeReductionPercentage: number;
  expectedErrorReductionPercentage: number;
}

export interface ROIInputValidation {
  field: keyof ROIInputData;
  message: string;
  severity: 'error' | 'warning';
}

// ============================================
// CALCULATION RESULT TYPES
// ============================================
export interface ROICalculationResult {
  // Summary metrics
  roiPercentage: number;
  netPresentValue: number;
  paybackPeriodMonths: number;
  breakEvenMonth: number;

  // Annual projections
  annualTimeSavingsHours: number;
  annualLaborCostSavings: number;
  annualErrorCostSavings: number;
  totalAnnualSavings: number;

  // Lifecycle analysis (5 years)
  totalInvestment: number;
  totalFiveYearSavings: number;
  totalFiveYearBenefit: number;

  // Year-by-year breakdown
  yearlyProjections: YearlyProjection[];
}

export interface YearlyProjection {
  year: number;
  costs: number;
  savings: number;
  cumulativeBenefit: number;
  cumulativeROI: number;
}

// ============================================
// CALCULATOR STATE TYPES
// ============================================
export interface ROICalculatorState {
  inputData: ROIInputData | null;
  calculationResult: ROICalculationResult | null;
  validationErrors: ROIInputValidation[];
  isCalculating: boolean;
  lastCalculatedAt: Date | null;
}

// ============================================
// LEAD CAPTURE TYPES
// ============================================
export interface ROILeadData {
  // Contact information
  fullName: string;
  email: string;
  company: string;
  phone?: string;

  // Context
  operationType: OperationType;
  calculationResult: ROICalculationResult;

  // Preferences
  interestedInConsultation: boolean;
  preferredContactMethod: 'email' | 'phone';
  notes?: string;

  // Metadata
  submittedAt: Date;
  calculatorVersion: string;
}

// ============================================
// EXPORT/SHARE TYPES
// ============================================
export interface ROIExportData {
  inputData: ROIInputData;
  calculationResult: ROICalculationResult;
  generatedAt: Date;
  format: 'pdf' | 'csv' | 'json';
}

export interface ROIShareOptions {
  includeInputData: boolean;
  includeCharts: boolean;
  includeYearlyBreakdown: boolean;
  recipientEmail?: string;
}
