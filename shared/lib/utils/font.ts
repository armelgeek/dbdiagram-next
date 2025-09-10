import { Archivo, Inter, Libre_Franklin } from 'next/font/google';

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});
const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});
const interVariable = 'var(--font-inter)';
const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const fontMap = {
  inter: {
    next: interFont,
    tailwind: interVariable,
  },
  archivo: {
    next: archivo,
    tailwind: 'var(--font-archivo)',
  },
  libre_franklin: {
    next: libre_franklin,
    tailwind: 'var(--font-libre_franklin)',
  },
};

export type AvailableFonts = keyof typeof fontMap;
export { fontMap };
