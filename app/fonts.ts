import localFont from 'next/font/local'

// Example font configuration - replace these with your actual font files
export const customFont = localFont({
  src: [
    {
      path: '../public/fonts/ATTAleckSans_W_Rg.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ATTAleckSans_W_Rg.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ATTAleckSans_W_Md.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/ATTAleckSans_W_Md.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/ATTAleckSans_W_Bd.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/ATTAleckSans_W_Bd.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-custom',
}) 