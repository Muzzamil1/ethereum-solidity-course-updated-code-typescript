import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'semantic-ui-css/semantic.min.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps, }: AppProps) {
  return (
    <>
      <Head>
        <title>Crowd Funding</title>
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
