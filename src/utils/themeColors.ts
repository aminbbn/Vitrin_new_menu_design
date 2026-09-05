import type * as React from 'react';
import { MenuThemeConfig } from '../types/menu';

/**
 * Normalizes 3-digit or 6-digit hex color strings to standard #RRGGBB uppercase.
 * Returns null if invalid or not a string.
 */
export function normalizeHex(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  const cleaned = trimmed.replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return `#${cleaned.toUpperCase()}`;
  }
  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    const expanded = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
    return `#${expanded.toUpperCase()}`;
  }
  return null;
}

/**
 * Converts a hex string into rgba(r, g, b, alpha).
 */
export function hexToRgba(hex: unknown, alpha: number): string {
  const norm = (typeof hex === 'string' ? normalizeHex(hex) : null) || '#000000';
  const r = parseInt(norm.slice(1, 3), 16);
  const g = parseInt(norm.slice(3, 5), 16);
  const b = parseInt(norm.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

/**
 * Calculates relative luminance (WCAG definition) of a hex color.
 */
export function getRelativeLuminance(hex: unknown): number {
  const norm = (typeof hex === 'string' ? normalizeHex(hex) : null) || '#000000';
  const r = parseInt(norm.slice(1, 3), 16) / 255;
  const g = parseInt(norm.slice(3, 5), 16) / 255;
  const b = parseInt(norm.slice(5, 7), 16) / 255;

  const toLinear = (val: number) =>
    val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Determines whether text placed over this background hex color
 * should be light (#ffffff) or dark (#0f172a) to ensure readable contrast.
 */
export function getContrastForeground(bgHex: unknown): string {
  if (typeof bgHex !== 'string') return '#ffffff';
  const lum = getRelativeLuminance(bgHex);
  // Standard threshold: if luminance > 0.38, dark foreground is more legible
  return lum > 0.38 ? '#0f172a' : '#ffffff';
}

/**
 * Calculates contrast ratio between two hex colors (1:1 up to 21:1).
 */
export function getContrastRatio(hex1: unknown, hex2: unknown): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if two hex colors are visually too similar.
 */
export function areColorsTooSimilar(hex1: unknown, hex2: unknown): boolean {
  const norm1 = (typeof hex1 === 'string' ? normalizeHex(hex1) : null) || '#000000';
  const norm2 = (typeof hex2 === 'string' ? normalizeHex(hex2) : null) || '#ffffff';
  const r1 = parseInt(norm1.slice(1, 3), 16);
  const g1 = parseInt(norm1.slice(3, 5), 16);
  const b1 = parseInt(norm1.slice(5, 7), 16);

  const r2 = parseInt(norm2.slice(1, 3), 16);
  const g2 = parseInt(norm2.slice(3, 5), 16);
  const b2 = parseInt(norm2.slice(5, 7), 16);

  const distance = Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
  );

  // Euclidean distance in RGB space < 55 indicates very close colors
  return distance < 55;
}

/**
 * Default color pairs for each theme style
 */
export const DEFAULT_THEME_COLORS: Record<string, { primary: string; secondary: string }> = {
  immersive: {
    primary: '#D4AF37', // Gold
    secondary: '#B76E79', // Rose Gold / Warm Copper
  },
  modern: {
    primary: '#0F766E', // Deep Hospitality Teal / Evergreen
    secondary: '#B7794B', // Warm Terracotta / Sienna
  },
  minimal: {
    primary: '#38BDF8', // Vibrant Sky / Cyan
    secondary: '#A78BFA', // Soft Violet / Lavender
  },
};

/**
 * Backward-compatible resolver for theme colors.
 * Prioritizes primaryColor / secondaryColor, falls back to legacy accentColor / accentColorLight,
 * and finally to theme-specific defaults.
 */
export function resolveThemeColors(
  config?: Partial<MenuThemeConfig> | null,
  themeId: string = 'immersive'
): { primary: string; secondary: string } {
  const fallback = DEFAULT_THEME_COLORS[themeId] || DEFAULT_THEME_COLORS.immersive;

  const primary = normalizeHex(config?.primaryColor || '') ||
    normalizeHex(config?.accentColor || '') ||
    fallback.primary;

  const secondary = normalizeHex(config?.secondaryColor || '') ||
    normalizeHex(config?.accentColorLight || '') ||
    fallback.secondary;

  return { primary, secondary };
}

/**
 * Generates CSS variables object for mounting on theme container.
 * Supports both getThemeCssVariables(primary, secondary, extra)
 * and getThemeCssVariables({ primary, secondary }, extra)
 */
export function getThemeCssVariables(
  primaryOrColors: string | { primary: string; secondary: string },
  secondaryOrExtra?: string | Record<string, string>,
  extra?: Record<string, string>
): React.CSSProperties {
  let primary: string;
  let secondary: string;
  let extraVars: Record<string, string> | undefined = extra;

  if (typeof primaryOrColors === 'object' && primaryOrColors !== null) {
    primary = primaryOrColors.primary;
    secondary = primaryOrColors.secondary;
    if (typeof secondaryOrExtra === 'object' && secondaryOrExtra !== null) {
      extraVars = secondaryOrExtra;
    }
  } else {
    primary = typeof primaryOrColors === 'string' ? primaryOrColors : '#D4AF37';
    secondary = typeof secondaryOrExtra === 'string' ? secondaryOrExtra : '#B76E79';
  }

  const normPrimary = normalizeHex(primary) || '#D4AF37';
  const normSecondary = normalizeHex(secondary) || '#B76E79';

  return {
    '--menu-primary': normPrimary,
    '--menu-secondary': normSecondary,
    '--menu-primary-fg': getContrastForeground(normPrimary),
    '--menu-secondary-fg': getContrastForeground(normSecondary),
    '--menu-primary-soft': hexToRgba(normPrimary, 0.14),
    '--menu-secondary-soft': hexToRgba(normSecondary, 0.14),
    '--menu-primary-border': hexToRgba(normPrimary, 0.35),
    '--menu-secondary-border': hexToRgba(normSecondary, 0.35),
    '--menu-primary-glow': hexToRgba(normPrimary, 0.25),
    '--menu-secondary-glow': hexToRgba(normSecondary, 0.2),
    ...(extraVars || {}),
  } as React.CSSProperties;
}
