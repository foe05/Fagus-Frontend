export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * Determine the current season based on calendar month.
 *   Spring:  March 1 – May 31
 *   Summer:  June 1 – August 31
 *   Autumn:  September 1 – November 30
 *   Winter:  December 1 – February 28/29
 */
export function getCurrentSeason(): Season {
  const month = new Date().getMonth(); // 0-indexed: 0=Jan, 11=Dec
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

/** Map each season to its tree image filename in /public/. */
export const SEASON_IMAGES: Record<Season, string> = {
  spring: '/baum-fruehling.webp',
  summer: '/baum-sommer.webp',
  autumn: '/baum-herbst.webp',
  winter: '/baum-winter.webp',
};

/** Fallback image when the seasonal variant is not yet available. */
export const FALLBACK_IMAGE = '/baum.webp';
