import React from 'react';
import Head from 'next/head';

// todo: Implement home page and an about page

export default function Home({ rollCount, episodeCount }) {
  return (
    <>
      <Head>
        <title>CRDB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <nav className="level is-mobile">
          <div className="level-item has-text-centered">
            <div>
              <p className="title">CritRoleDB</p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Roll Count</p>
              <p className="title">{rollCount}</p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Episodes</p>
              <p className="title">{episodeCount}</p>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export async function getStaticProps() {
  console.log('asdad');
  return { props: { rollCount: 25000, episodeCount: 220 }};
}
