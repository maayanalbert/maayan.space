import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <>
      {/* @ts-ignore */}
      <Html lang="en">
        {/* @ts-ignore */}
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Playfair+Display:wght@400;700&family=Space+Grotesk:wght@400;500;700&family=DM+Sans:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          {/* @ts-ignore */}
          <Main />
          {/* @ts-ignore */}
          <NextScript />
        </body>
      </Html>
    </>
  )
}
