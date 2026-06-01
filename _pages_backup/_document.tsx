import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Portfolio of Nazmus Sakib Siraji — Software Engineer, Technical Project Manager, and Founder of Technonix." />
        <meta property="og:title" content="Nazmus Sakib Siraji — Software Engineer & Technical PM" />
        <meta property="og:description" content="Building software and leading teams across Bangladesh, Dubai, UK, Malaysia, and East Africa." />
        <meta name="theme-color" content="#080808" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
