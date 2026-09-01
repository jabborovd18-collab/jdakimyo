import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      // O'zbekcha matndagi tutuq belgisi JSX ichida juda ko'p uchraydi;
      // uni HTML entity'ga aylantirish matnni o'qish va qidirishni yomonlashtiradi.
      'react/no-unescaped-entities': 'off',

      // Loyiha React Compiler'dan foydalanmaydi. Bu qoidalar mavjud imperativ
      // Three.js va eski hook arxitekturasini xato deb belgilaydi, ammo runtime
      // nuqsonini ko'rsatmaydi. Hooklar tartibi qoidasi esa yoqilganicha qoladi.
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'next-env.d.ts',
    // Brauzer bajaradigan manba emas; uchinchi tomon 3D va media fayllari.
    'public/**',
  ]),
])
