import axios from 'axios';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';

const fetchData = async () => axios.get(`${process.env.DB_HOST}/episodes/api/episode`).then(
  (res) => ({
    error: false,
    episodes: res.data,
  }),
).catch(() => ({
  error: true,
  episodes: null,
}));

const Episodes = ({ episodes }) => (
  <>
    <Head>
      <title>CRDB | Episodes</title>
    </Head>
    <div className="content">
      <ul>
        {episodes.results.map((ep) => (
          <li key={ep.id}>
            EP
            {' '}
            {ep.num}
            <Link href="/episodes/[id]" as={`/episodes/${ep.id}`}>
              <a>
                {' '}
                {ep.title}
              </a>
            </Link>

            {ep.is_live === true && <span className="tag is-light">Live</span>}
          </li>
        ))}
      </ul>
    </div>
  </>
);

Episodes.propTypes = {
  episodes: PropTypes.shape({
    results: PropTypes.array,
  }).isRequired,
};

export const getServerSideProps = async () => {
  const data = await fetchData();
  return {
    props: data,
  };
};

export default Episodes;
