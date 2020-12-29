import React from 'react';
import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>CRDB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="content">
        <h1>About</h1>
        <p>This is the about page.</p>
      </div>
    </>
  );
}
