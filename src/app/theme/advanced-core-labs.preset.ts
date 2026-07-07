import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

export const AdvancedCoreLabsPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
      950: '#083344',
    },
    extend: {
      acl: {
        navy: '#0F172A',
        slate: '#1E293B',
        cyan: '#22D3EE',
        background: '#F8FAFC',
      },
    },
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
    },
  },
});
