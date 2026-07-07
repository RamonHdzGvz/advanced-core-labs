import Lara from '@primeuix/themes/lara';
import { definePreset } from '@primeuix/themes';
import { AppThemeConfig, DEFAULT_THEME_CONFIG } from './theme.config';
import { AdvancedCoreLabsPreset } from './advanced-core-labs.preset';

export function createPrimeTheme(config: AppThemeConfig = DEFAULT_THEME_CONFIG) {
  return AdvancedCoreLabsPreset;
  //return definePreset(Lara, {});
}