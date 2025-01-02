import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { LoadingUI } from '~/components/Loading';
import { Provider } from 'jotai';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'デカフェマップ',
  description: 'デカフェのお店を見つけて、登録できるアプリ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no"
        ></meta>
      </head>
      <Provider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <LoadingUI />
          {children}
        </body>
      </Provider>
    </html>
  );
}
