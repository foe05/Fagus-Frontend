// ============================================
// PRIMARY KEYWORDS
// ============================================
export const PRIMARY_KEYWORDS = [
  'Forstdigitalisierung',
  'IT-Beratung Forst',
  'Forstsoftware',
  'Digitalisierung Forstbetrieb',
  'Forst IT Consulting',
  'AI-First Forstbetriebe',
] as const;

// ============================================
// SECONDARY KEYWORDS
// ============================================
export const SECONDARY_KEYWORDS = [
  'Waldmanagement Software',
  'Forstbetrieb digitalisieren',
  'Prozessoptimierung Forst',
  'Hegegemeinschaft Management',
  'Wildtiermanagement Software',
  'Forststraßenbau Software',
  'Holzlogistik digitalisieren',
  'Revierplanung digital',
  'Jagdverwaltung Software',
  'Forstbetrieb IT-Lösungen',
] as const;

// ============================================
// LONG-TAIL KEYWORDS
// ============================================
export const LONG_TAIL_KEYWORDS = [
  'Software für Hegegemeinschaften',
  'Digitale Abschussplanung Jäger',
  'Erdmassenberechnung Forststraßen',
  'Holzvermarktung digitalisieren',
  'Revierübergreifendes Wildtiermanagement',
  'Change Management Forstbetriebe',
  'MVP Entwicklung Forstwirtschaft',
  'Prototyping für Forstbetriebe',
  'AI-First IT-Beratung Wald',
  'Digitalisierungsstrategie Forstwirtschaft',
] as const;

// ============================================
// SERVICE-RELATED KEYWORDS
// ============================================
export const SERVICE_KEYWORDS = {
  digitalization: [
    'Digitalisierungsstrategie Forst',
    'Digitale Transformation Forstbetrieb',
    'Forstbetrieb digitalisieren',
    'IT-Strategie Forstwirtschaft',
  ],
  processOptimization: [
    'Prozessoptimierung Forst',
    'Automatisierung Forstbetrieb',
    'Workflow Digitalisierung Wald',
    'Effizienzsteigerung Forstwirtschaft',
  ],
  changeManagement: [
    'Change Management Forst',
    'Digitaler Wandel Forstbetrieb',
    'Mitarbeiter Schulung Forstsoftware',
    'Akzeptanz digitale Tools Forst',
  ],
  prototyping: [
    'MVP Entwicklung Forst',
    'Prototyping Forstsoftware',
    'Rapid Development Forstbetrieb',
    'Proof of Concept Forstwirtschaft',
  ],
} as const;

// ============================================
// PRODUCT-RELATED KEYWORDS
// ============================================
export const PRODUCT_KEYWORDS = {
  hegegemeinschaft: [
    'Hegegemeinschaft Software',
    'Wildtiermanagement digital',
    'Abschussplanung Software',
    'Jagdrevier Management System',
    'Revierübergreifende Jagd Software',
  ],
  earthwork: [
    'Erdmassenberechnung Software',
    'Forststraßenbau Kalkulation',
    'Massenermittlung Forststraßen',
    'Digitale Bauplanung Forst',
  ],
  hosting: [
    'Hosting Forstsoftware',
    'Cloud Lösungen Forstbetrieb',
    'Support Forstsoftware',
    'Betrieb Forst IT-Systeme',
  ],
} as const;

// ============================================
// TARGET AUDIENCE KEYWORDS
// ============================================
export const AUDIENCE_KEYWORDS = [
  'Forstbetrieb',
  'Waldbesitzer',
  'Jäger',
  'Hegegemeinschaft',
  'Förster',
  'Forstwirtschaft',
  'Revierleiter',
  'Jagdpächter',
] as const;

// ============================================
// LOCATION KEYWORDS
// ============================================
export const LOCATION_KEYWORDS = [
  'Deutschland',
  'Hessen',
  'Kassel',
  'Nordhessen',
] as const;

// ============================================
// TECHNOLOGY KEYWORDS
// ============================================
export const TECHNOLOGY_KEYWORDS = [
  'AI-First',
  'Künstliche Intelligenz Forst',
  'Machine Learning Forstwirtschaft',
  'Cloud Computing Forstbetrieb',
  'Mobile App Jäger',
  'Echtzeit-Synchronisation',
  'Agile Entwicklung Forst',
] as const;

// ============================================
// KEYWORD HELPERS
// ============================================

/**
 * Get all keywords as a flat array
 */
export function getAllKeywords(): string[] {
  return [
    ...PRIMARY_KEYWORDS,
    ...SECONDARY_KEYWORDS,
    ...LONG_TAIL_KEYWORDS,
    ...Object.values(SERVICE_KEYWORDS).flat(),
    ...Object.values(PRODUCT_KEYWORDS).flat(),
    ...AUDIENCE_KEYWORDS,
    ...LOCATION_KEYWORDS,
    ...TECHNOLOGY_KEYWORDS,
  ];
}

/**
 * Get keywords for a specific service
 */
export function getServiceKeywords(service: keyof typeof SERVICE_KEYWORDS): readonly string[] {
  return SERVICE_KEYWORDS[service];
}

/**
 * Get keywords for a specific product
 */
export function getProductKeywords(product: keyof typeof PRODUCT_KEYWORDS): readonly string[] {
  return PRODUCT_KEYWORDS[product];
}

/**
 * Generate a comma-separated keyword string for meta tags
 */
export function getKeywordString(keywords: readonly string[]): string {
  return keywords.join(', ');
}
