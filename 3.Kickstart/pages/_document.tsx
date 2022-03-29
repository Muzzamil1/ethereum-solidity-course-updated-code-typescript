import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='icon' href='/favicon.ico'></link>
        </Head>

        <body>
          <Main></Main>

          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
