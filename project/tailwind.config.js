/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mint: {
          DEFAULT: '#8ECFB5',
          light: '#DDF5EC',
          dark: '#23493B',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#E0C56A',
          dark: '#A08416',
        },
        cream: '#FAFBFA',
        fog: '#F5F5F5',
        ink: '#202020',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Poppins', 'sans-serif'],
        btn: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        luxe: '0 20px 60px -15px rgba(35, 73, 59, 0.18)',
        'luxe-sm': '0 10px 30px -10px rgba(35, 73, 59, 0.15)',
        gold: '0 12px 40px -12px rgba(201, 162, 39, 0.45)',
        soft: '0 4px 20px -4px rgba(32, 32, 32, 0.08)',
      },
      backgroundImage: {
        'mint-gradient': 'linear-gradient(135deg, #DDF5EC 0%, #8ECFB5 100%)',
        'mint-radial': 'radial-gradient(circle at 30% 20%, #DDF5EC 0%, transparent 60%)',
        'gold-gradient': 'linear-gradient(135deg, #E0C56A 0%, #C9A227 100%)',
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'float-mid': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'fade-up': 'fadeUp 0.7s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-22px) rotate(6deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
