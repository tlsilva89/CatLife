import { defineConfig, presetUno, presetIcons, presetWebFonts, presetTypography } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Nunito:400,500,600,700',
        heading: 'Quicksand:500,600,700',
      },
    }),
  ],
  theme: {
    colors: {
      cat: {
        bg: '#FDFBF7',
        primary: '#E07A5F',
        secondary: '#81B29A',
        warning: '#F2CC8F',
        text: '#3D405B',
        textLight: '#8A8D9E',
        card: '#FFFFFF',
        border: '#E8E5E1'
      }
    }
  },
  shortcuts: {
    'btn-primary': 'bg-cat-primary text-white px-4 py-2 rounded-xl font-heading font-semibold hover:opacity-90 transition-opacity active:scale-95',
    'btn-secondary': 'bg-cat-secondary text-white px-4 py-2 rounded-xl font-heading font-semibold hover:opacity-90 transition-opacity active:scale-95',
    'btn-outline': 'border-2 border-cat-primary text-cat-primary px-4 py-2 rounded-xl font-heading font-semibold hover:bg-cat-primary hover:text-white transition-colors active:scale-95',
    'card': 'bg-cat-card rounded-2xl p-4 shadow-sm border border-cat-border',
    'input-field': 'w-full bg-cat-bg border border-cat-border rounded-xl px-4 py-2 text-cat-text focus:outline-none focus:border-cat-primary focus:ring-1 focus:ring-cat-primary transition-all'
  }
});